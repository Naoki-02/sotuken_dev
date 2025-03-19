import base64
import json
import logging
import os
import re

import requests
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
from openai import OpenAI
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (CookHistory, Dish, DishIngredient, DishInstruction,
                     Ingredient, Ingredients, Instruction, Meal, Recipe)
from .serializers import (CookHistorySerializer, IngredientSerializer,
                          MealSerializer, RecipeSerializer)


class Recipe_1DaySuggestionView(APIView):
    # このビューに認証を必須にする
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            # 現在ログインしているユーザーの材料を取得
            ingredients = Ingredients.objects.filter(user=request.user)
            ingredient_names = [ingredient.name for ingredient in ingredients]
            meals = []

            if not ingredient_names:
                return JsonResponse({"error": "No ingredients found for the user."}, status=400)

            # ChatGPT API用プロンプトを生成
            prompt = self.generate_prompt(ingredient_names)
            ststem_prompt = """
            あなたは料理の専門家です。
            ユーザからの材料リストを基に作れる料理を提案してください。以下のフォーマットで結果を返してください：            
            {
                "breakfast": [
                    {
                        "type": "主菜",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）"
                    },
                    {
                        "type": "副菜",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）",
                    },
                    {
                        "type": "汁物",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）",
                    }
                ],
                "lunch": [
                    {
                        "type": "主菜",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）",
                    },
                    {
                        "type": "副菜",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）",
                    },
                    {
                        "type": "汁物",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）",
                    }
                ],
                "dinner": [
                    {
                        "type": "主菜",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）",
                    },
                    {
                        "type": "副菜",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）",
                    },
                    {
                        "type": "汁物",
                        "name": "料理名",
                        "ingredients": ["必要な材料1", "必要な材料2", ...],
                        "description": "料理の簡単な説明",
                        "instructions": ["手順1","手順2","手順3",...],
                        "cookingTime": "調理時間（例: 約30分）",
                    }
                ]
            }
            
            
            ※ 一日分の献立を提案してください。朝食、昼食、夕食の3食分を提案してください。
            ※ 主菜、副菜、汁物の3品からなる一汁三菜の献立を提案してください。
            ※ 可能な限り所持している材料を活用してください。
            ※ descriptionには食欲がそそられるようなユニークな説明を記述してください。
            ※ 説明と手順を具体的に記述してください。手順には調味料も含めてください。
            ※ 絶対に必要な材料に調味料などは含めないでください。
            ※ JSON形式でのみ返答してください。不要な文字やフォーマットは一切含めないでください。
            """

            # ChatGPT APIにリクエストを送信
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": ststem_prompt},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=5000,
                temperature=0.5,
            )

            # APIのレスポンスを解析
            recipes_jsondata = json.loads(response.choices[0].message.content)
            # recipes_data=response.choices[0].message.content
            # レスポンス内容をテキストファイルに保存
            file_path = os.path.join(settings.BASE_DIR, "debug_response.txt")
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(response.choices[0].message.content)

            for meal_time, meal_dishes in recipes_jsondata.items():
                meal = Meal.objects.create(
                    user=request.user, meal_time=meal_time)

                for dish_data in meal_dishes:

                    dish = Dish.objects.create(
                        user=request.user,
                        name=dish_data["name"],
                        description=dish_data["description"],
                        cooking_time=dish_data["cookingTime"],
                        meal_type=dish_data["type"]
                    )

                    for ingredient_name in dish_data["ingredients"]:
                        DishIngredient.objects.create(
                            dish=dish, name=ingredient_name)

                    for step_number, instruction_text in enumerate(dish_data["instructions"], start=1):
                        DishInstruction.objects.create(
                            dish=dish, step_number=step_number, description=instruction_text)

                    meal.dishes.add(dish)

                meal.save()
                meals.append(meal)

            meal_serializer = MealSerializer(meals, many=True)

            return JsonResponse({"meal": meal_serializer.data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def generate_prompt(self, ingredients):
        # ChatGPT API用のプロンプトを生成するメソッド。
        return f"""
        以下はあなたが利用可能な材料のリストです：
        {", ".join(ingredients)}
        """


class RecipeSuggestionView(APIView):
    # このビューに認証を必須にする
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            # 現在ログインしているユーザーの材料を取得
            ingredients = Ingredients.objects.filter(user=request.user)
            ingredient_names = [ingredient.name for ingredient in ingredients]
            saved_recipe = []

            if not ingredient_names:
                return JsonResponse({"error": "No ingredients found for the user."}, status=400)

            # ChatGPT API用プロンプトを生成
            prompt = self.generate_prompt(ingredient_names)
            ststem_prompt = """
            あなたは料理の専門家です。
            ユーザからの材料リストを基に作れる料理を提案してください。以下のフォーマットで結果を返してください：
            [
            {
                "name": "料理名",
                "ingredients": ["必要な材料1", "必要な材料2", ...],
                "description": "料理の簡単な説明",
                "instructions": [
                "手順1",
                "手順2",
                "手順3",
                ...
                ],
                "cookingTime": "調理時間（例: 約30分）",
                "difficulty": "難易度（例: 簡単、普通、難しい）"
            },
            ...
            ]
            
            ※ レシピは最低9つ提案してください。
            ※ 可能な限り所持している材料を活用してください。
            ※ 所持していない材料が必要な場合は、それを補足材料としてリストに含めてください。
            ※ descriptionには食欲がそそられるようなユニークな説明を記述してください。
            ※ 説明と手順を具体的に記述してください。手順には調味料も含めてください。
            ※ 必要な材料に調味料などは含めないでください。
            ※ JSON形式でのみ返答してください。不要な文字やフォーマットは一切含めないでください。
            """

            # ChatGPT APIにリクエストを送信
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": ststem_prompt},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=4000,
                temperature=0.5,
            )

            # APIのレスポンスを解析
            recipes_jsondata = json.loads(response.choices[0].message.content)
            # recipes_data=response.choices[0].message.content
            # レスポンス内容をテキストファイルに保存
            file_path = os.path.join(settings.BASE_DIR, "debug_response.txt")
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(response.choices[0].message.content)

            for recipe_data in recipes_jsondata:
                recipe = Recipe(
                    user=request.user,
                    name=recipe_data["name"],
                    description=recipe_data["description"],
                    cooking_time=recipe_data["cookingTime"],
                    difficulty=recipe_data["difficulty"]
                )
                # Recipeモデルを保存
                recipe.save()

                # ingredientモデルを保存
                for ingredient_name in recipe_data["ingredients"]:
                    Ingredient.objects.create(
                        recipe=recipe, name=ingredient_name)

                # Instructionモデルを保存
                for step_number, instruction_text in enumerate(recipe_data["instructions"], start=1):
                    Instruction.objects.create(
                        recipe=recipe, step_number=step_number, description=instruction_text)

                # 保存したレシピをリストに追加
                saved_recipe.append(recipe)

            # 保存したすべてのレシピをシリアライズ
            serializer = RecipeSerializer(saved_recipe, many=True)
            return JsonResponse({"recipes": serializer.data}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def generate_prompt(self, ingredients):
        # ChatGPT API用のプロンプトを生成するメソッド。
        return f"""
        以下はあなたが利用可能な材料のリストです：
        {", ".join(ingredients)}
        """


class PostIngredientsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data

            ingredients_list = data.get('ingredients', [])

            if not ingredients_list:
                return JsonResponse({'message': 'Ingredients are required'}, status=400)

            for ingredient_data in ingredients_list:
                if not ingredient_data.get('name'):
                    return JsonResponse({'message': 'Name is required for each ingredient'}, status=400)

                ingredients = Ingredients(
                    user_id=request.user.id,
                    name=ingredient_data.get('name'),
                    quantity=ingredient_data.get('quantity'),
                    category=ingredient_data.get('category')
                )
                ingredients.save()

            return JsonResponse({'message': 'Ingredients saved successfully!'}, status=201)

        except Exception as e:
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


class GetIngredientsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]  # ユーザ認証が必要
    serializer_class = IngredientSerializer

    def get_queryset(self):
        return Ingredients.objects.filter(user=self.request.user)


class DeleteIngredients(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            Ingredients.objects.get(pk=pk).delete()
            return JsonResponse({'message': '材料が正常に削除されました！'}, status=200)
        except Ingredients.DoesNotExist:
            return JsonResponse({'error': '材料が見つかりません'}, status=404)
        except Exception as e:
            return JsonResponse({'error': '内部サーバーエラーが発生しました'}, status=500)


class DeleteUseIngredients(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            recipe_id = request.data.get("recipe_id")
            names = request.data.get("names", [])  # 複数の食材名をリストとして取得
            not_found_items = []

            if (recipe_id):
                try:
                    recipe = Recipe.objects.get(id=recipe_id)
                except Recipe.DoesNotExist:
                    return JsonResponse({'error': 'レシピが見つかりません'}, status=404)

                CookHistory.objects.create(
                    user=request.user,
                    recipe=recipe,
                )

            for name in names:
                ingredient = Ingredients.objects.filter(
                    user=request.user, name__icontains=name).first()
                if ingredient:
                    ingredient.delete()
                else:
                    not_found_items.append(name)

            response = {'message': '材料が正常に削除されました！'}
            if not_found_items:
                response['not_found_items'] = not_found_items

            return JsonResponse(response, status=200)

        except Exception as e:
            return JsonResponse({'error': '内部サーバーエラーが発生しました'}, status=500)


class UpdateIngredients(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            ingredient = Ingredients.objects.get(pk=pk)
            data = request.data

            if 'name' in data:
                ingredient.name = data['name']
            if 'quantity' in data:
                ingredient.quantity = data['quantity']
            if 'category' in data:
                ingredient.category = data['category']

            ingredient.save()
            return JsonResponse({'message': '材料が正常に更新されました！'}, status=200)
        except Ingredients.DoesNotExist:
            return JsonResponse({'error': '材料が見つかりません'}, status=404)
        except Exception as e:
            return JsonResponse({'error': '内部サーバーエラーが発生しました'}, status=500)


class OCRView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザ認証が必要

    def categorize_item(self, item_name):
        # カテゴリキーワードを定義
        categories = {
            "肉": ["豚", "鶏", "牛", "肉", "しゃぶしゃぶ", "ベーコン", "ハム", "ソーセージ", "ミンチ", "ハンバーグ", "ステーキ", "チキン", "ハンバーグ", "とり", "唐揚", "つくね"],
            "魚": ["魚", "鮭", "鯖", "帆立", "貝", "刺身", "海老", "太子"],
            "野菜": ["キャベツ", "玉ねぎ", "トマト", "レタス", "生姜", "きゅうり", "大根", "人参", "茄子", "ぶなしめじ", "トマト", "じゃが芋", "ほうれん草", "かぼちゃ", "ブロッコリー"],
            "乳製品": ["牛乳", "ヨーグルト", "チーズ", "バター", "生クリーム", "アイスクリーム", "バニラ"],
            "果物": ["リンゴ", "バナナ", "オレンジ", "イチゴ", "ブドウ", "メロン", "スイカ", "パイナップル", "キウイ", "柿", "梨", "桃", "さくらんぼ", "いちじく", "マンゴー"],
        }

        # 商品名に含まれるキーワードをもとにカテゴリを割り当て
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in item_name:
                    return category

        # 該当するカテゴリがなければ「その他」
        return "その他"

    # 商品名を抽出する関数
    def extract_items(self, receipt_data):
        items = []
        start_parsing = False  # 商品抽出を開始するフラグ

        # ドンキ、ヤオコー、ヨークベニマル、ほげ、よしやなどのレシートの商品名を抽出

        for entry in receipt_data:
            # パターン1: "*"で始まる商品の抽出
            match_star = re.match(r"^\* \s*(.+)", entry)
            if match_star:
                # 商品名が数字だけの場合を除外
                item = match_star.group(1).strip()
                if not item.isdigit():  # 数字だけの文字列は除外
                    items.append(item)
                continue

            # パターン2: 数字3桁の後に続く商品の抽出
            match_number = re.match(r"^\d{3}\s+(.+)", entry)
            if match_number:
                item = match_number.group(1).strip()
                # 数字だけの文字列は除外
                if not item.isdigit():
                    items.append(item)

            # パターン3: 03*, 13*, 01* で始まる商品の抽出
            match_custom = re.match(r"^(03|13|01)\*?\s*(.+)", entry)
            if match_custom:
                item = match_custom.group(2).strip()
                if item and not item.isdigit():  # 数字だけの文字列は除外
                    items.append(item)

            # パターン4: 数字4桁の後に続く商品の抽出
            match_four_digit = re.match(r"^\d{4}\s+(.+)", entry)
            if match_four_digit:
                item = match_four_digit.group(1).strip()
                if not item.isdigit():
                    items.append(item)

            # パターン5: "外"で始まり数字何桁かの後に続く文字列の抽出
            match_out_number = re.match(r"^外\d+\s*(.+)", entry)
            if match_out_number:
                item = match_out_number.group(1).strip()
                # 数字部分を取り除く（先頭の数字を取り除く）
                item = re.sub(r'^\d+', '', item).strip()
                if item and not item.isdigit():
                    items.append(item)

            # パターン6: 数字+ '*' の後に続く文字列の抽出
            match_digit_star = re.match(r"^\d+\* \s*(.*?)(?:\s*¥|\s*$)", entry)
            if match_digit_star:
                item = match_digit_star.group(1).strip()

                # 数字と記号（または数字＋ハイフン＋数字）の部分を除外
                if re.match(r"^\d+[-\d\s]+$", item):  # 数字とハイフン、スペースだけの部分を除外
                    continue

                # ひらがな、カタカナ、漢字、英語を含む商品名のみを抽出
                if item and not item.isdigit() and re.search(r'[A-Za-zぁ-んァ-ン一-龯]', item):
                    items.append(item)
                    
            # パターン7: "取" と "青" を含むエントリを検出し、商品抽出を開始する
            if re.search(r"取.*青.*", entry):
                start_parsing = True
                continue
            
            # パターン終了条件
            if start_parsing and entry == "小計":
                break
            
            # 商品データの抽出を開始
            if start_parsing:
                # 商品名として抽出する条件
                if re.search(r'[ぁ-んァ-ン一-龯]', entry):  # 日本語文字を含む行を対象
                    # 価格や数量の行ではなく、商品名と見なせるものを抽出
                    if not re.match(r'^\d+.*|.*[%円¥]$', entry):  # 数字や価格を除外
                        items.append(entry.strip())

        return items
    
    def clean_and_filter_item_names(self,entries):
        item_names = []
        for entry in entries:
            # 不要な情報を削除 (例: 数量や単位)
            entry_cleaned = re.sub(r'\s*\(.*?\)|\d+[Xx]|\d+\*|[()（）]', '', entry).strip()
            
            # 日本語文字、英語を含むかチェックし、除外条件も設定
            if re.search(r'[ぁ-んァ-ン一-龯A-Za-z]', entry_cleaned) and not re.search(r'割引|X|単|%|¥', entry_cleaned):
                item_names.append(entry_cleaned)
        return item_names

    def post(self, request, *args, **kwargs):
        # ファイルを取得
        uploaded_file: InMemoryUploadedFile = request.FILES.get('image', None)

        if not uploaded_file:
            return Response({"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 画像データをBase64エンコード
            image_data = base64.b64encode(uploaded_file.read()).decode("utf-8")

            # Google Vision APIのURL
            url = f"https://vision.googleapis.com/v1/images:annotate?key={
                settings.VISION_API_KEY}"

            # リクエストデータの作成
            request_data = {
                "requests": [
                    {
                        "image": {"content": image_data},
                        "features": [{"type": "TEXT_DETECTION"}],
                    }
                ]
            }

            # APIリクエストを送信
            response = requests.post(url, json=request_data)

            # エラー処理
            if response.status_code != 200:
                return Response(
                    {"error": f"Error: {response.status_code}, {response.text}"},
                    status=response.status_code,
                )

            # レスポンスからテキストを抽出
            response_data = response.json()

            # 画像OCRデータをJSONファイルに保存
            # try:
            #     with open("camera.json", "w", encoding="utf-8") as json_file:
            #         json.dump(response_data, json_file, ensure_ascii=False, indent=4)
            #     print(f"Data successfully saved to JSON file.")
            # except Exception as e:
            #     print(f"An error occurred while saving to JSON: {e}")

            try:
                text = response_data["responses"][0]["textAnnotations"][0]["description"]
            except (KeyError, IndexError):
                text = "No text detected."

            # テキストを行ごとに分割
            lines = text.split("\n")
            # file_path = os.path.join(settings.BASE_DIR, "debug_response.txt")
            # with open(file_path, "w", encoding="utf-8") as file:
            #     file.write(str(lines))

            result1 = self.extract_items(lines)
            result2 = self.clean_and_filter_item_names(result1)
            categorize_item = {
                item: self.categorize_item(item) for item in result2}
            ingredients_list = []

            for item, category in categorize_item.items():
                ingredient_data = {
                    'name': item,
                    'category': category
                }

                if not ingredient_data['name']:
                    return JsonResponse({'message': 'Name is required for each ingredient'}, status=400)

                ingredients_list.append(ingredient_data)

            for ingredient in ingredients_list:
                ingredients = Ingredients(
                    user_id=request.user.id,
                    name=ingredient.get('name'),
                    category=ingredient.get('category')
                )
                ingredients.save()

            return Response({"message": "保存完了しました。"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CookHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # ユーザーの調理履歴を取得
            history = CookHistory.objects.filter(user=request.user)

            # シリアライザーを使用してデータをシリアライズ
            serializer = CookHistorySerializer(history, many=True)

            return JsonResponse({'history': serializer.data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class RemakeRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    # CookHistoryの最新のレシピを取得しそのレシピと現在所持している食材ingredientsモデルから新たなリメイクレシピを提案
    def get(self, request):
        try:
            saved_recipe_remake = []
            # 最新のCookHistoryを取得
            latest_history = CookHistory.objects.filter(
                user=request.user).order_by('-cooked_at').first()
            if not latest_history:
                return JsonResponse({'message': '調理履歴が見つかりません'}, status=404)
            # 最新のレシピの名前を取得
            latest_recipe_name = latest_history.recipe.name

            # 現在所持している食材を取得
            owned_ingredients = Ingredients.objects.filter(user=request.user)
            # 所持している食材の名前をリスト化
            ingredient_names = [
                ingredient.name for ingredient in owned_ingredients]

            if not ingredient_names:
                return JsonResponse({"error": "No ingredients found for the user."}, status=400)
            # リメイクレシピの提案ロジック ChatGPT APIを使用
            # ChatGPT API用プロンプトを生成
            prompt = self.Remake_prompt(ingredient_names, latest_recipe_name)
            ststem_prompt = """
            あなたは残り物料理を使ってアレンジするリメイク料理専門家です。
            ユーザからの残り物料理と材料リストを基に作れる料理を提案してください。以下のフォーマットで結果を返してください：
            [
            {
                "name": "料理名",
                "ingredients": ["残り物料理","必要な材料1", "必要な材料2", ...],
                "description": "料理の詳しい説明",
                "instructions": [
                "手順1",
                "手順2",
                "手順3",
                ...
                ],
                "cookingTime": "調理時間（例: 約30分）",
                "difficulty": "難易度（例: 簡単、普通、難しい）"
            },
            ...
            ]

            ※ レシピは最低9つ提案してください。
            ※ descriptionには食欲がそそられるようなユニークな説明を記述してください。
            ※ 可能な限り所持している材料を活用してください。
            ※ 説明と手順を具体的に記述してください。手順には調味料も含めてください。
            ※ 必要な材料に調味料は含めないでください。
            ※ JSON形式でのみ返答してください。不要な文字やフォーマットは一切含めないでください。
            """

            # ChatGPT APIにリクエストを送信
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": ststem_prompt},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=4000,
                temperature=0.5,
            )

            try:
                # APIのレスポンスを解析
                remake_jsondata = json.loads(response.choices[0].message.content)
            except (json.JSONDecodeError,AttributeError) as e:
                return JsonResponse({'error': 'JSONデコードエラー'}, status=500)
            # レスポンス内容をテキストファイルに保存
            file_path = os.path.join(settings.BASE_DIR, "debug_response.txt")
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(response.choices[0].message.content)
                
            for recipe_data in remake_jsondata:
                recipe = Recipe(
                    user=request.user,
                    name=recipe_data["name"],
                    description=recipe_data["description"],
                    cooking_time=recipe_data["cookingTime"],
                    difficulty=recipe_data["difficulty"]
                )
                # Recipeモデルを保存
                recipe.save()

                # ingredientモデルを保存
                for ingredient_name in recipe_data["ingredients"]:
                    Ingredient.objects.create(
                        recipe=recipe, name=ingredient_name)

                # Instructionモデルを保存
                for step_number, instruction_text in enumerate(recipe_data["instructions"], start=1):
                    Instruction.objects.create(
                        recipe=recipe, step_number=step_number, description=instruction_text)

                # 保存したレシピをリストに追加
                saved_recipe_remake.append(recipe)

            # 保存したすべてのレシピをシリアライズ
            serializer = RecipeSerializer(saved_recipe_remake, many=True)
            return JsonResponse({"remake_recipe": serializer.data}, status=200)

            # return JsonResponse({'remake_recipe': remake_jsondata}, status=200)
            # return JsonResponse({'message': 'リメイクレシピの提案は現在利用できません'}, status=501)
        except Exception as e:
            return JsonResponse({'error': '内部サーバーエラーが発生しました'}, status=500)

    def Remake_prompt(self, ingredients, latest_recipe_name):
        """
        ChatGPT API用のプロンプトを生成するメソッド。
        :param ingredients: 利用可能な材料のリスト
        :param latest_recipe_name: 調理済み最新のレシピ名
        :return: API用プロンプト
        """
        return f"""
        以下はあなたが利用可能な材料のリストです：
        {", ".join(ingredients)}

        これらの材料と残り物料理「{latest_recipe_name}」を使ってリメイク料理を提案してください。
        """
