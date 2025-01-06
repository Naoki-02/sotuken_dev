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

from .models import CookHistory, Ingredient, Ingredients, Instruction, Recipe
from .serializers import IngredientSerializer, RecipeSerializer

logger = logging.getLogger('myapp')

class ChatGPTView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # client = OpenAI(api_key=settings.OEPNAI_API_KEY)
        user_message = request.POST.get('message')

        try:

            # response = client.chat.completions.create(
            #     model="gpt-3.5-turbo",
            #     # 6. come up with three menus: breakfast, lunch, and dinner.
            #     # "lunch": [{ ... }],
            #     # "dinner": [{ ... }]
            #     messages=[
            #         {"role": "system", "content": """You are the assistant of the menu suggestion AI. Please suggest a nutritionally balanced menu using the given list of ingredients. Please return your response in JSON format according to the following criteria: 1: 1.
            #             1. propose a one-soup, three-course menu that includes a main dish, a side dish, and a soup. 2.
            #             2. use the specified ingredients as much as possible. 3.
            #             3. for each dish, include the name of the dish, ingredients used, and brief cooking instructions.
            #             4. include comments on nutritional balance.
            #             5. use up all ingredients completely.
            #             6. Responses must be returned in Japanese.
            #             7. Always return the response in json format.
            #             Generate a JSON response in the following format
            #             {
            #                 "menu": [
            #                     "breakfast": [{
            #                         "type": "main dish",
            #                         "name": "name of dish",
            #                         "ingredients": ["ingredient 1", "ingredient 2", ...],
            #                         "instructions": "Brief description of the cooking procedure",
            #                         },
            #                         {
            #                         "type": "side dish",
            #                         "name": "name of dish",
            #                         "ingredients": ["ingredient 1", "ingredient 2", ...],
            #                         "instructions": "Brief description of the cooking procedure",
            #                         },
            #                         {
            #                         "type": "soup", {
            #                         "name“: "name of dish",
            #                         "ingredients": ["ingredient 1", "ingredient 2", ...],
            #                         "instructions": "Brief description of the cooking procedure"
            #                     }],
            #                 ],
            #                 "nutritional_comment": "Comment on nutritional balance"
            #             Using the given list of ingredients, please suggest a menu in the above format."""
            #         },
                    
            #         {"role": "user", "content": user_message},
            #     ],
            # )
            
            # gpt_response = response.choices[0].message.content.strip()
            # data = json.loads(gpt_response)
            
            try:
                # JSONレスポンスをPythonの辞書に変換
                with open('tmp.json','r') as f:
                    data = json.load(f)
                # json.dump関数を使ったJSONファイルへの書き出し
                # with open('tmp.json', 'wt') as f:
                    # json.dump(data, f)
            except json.JSONDecodeError:
                data = None
            
            if data is not None:
                return JsonResponse({'response': data["menu"][0]["name"]}, status=200)
            else:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
        # except client.error.RateLimitError:
        #     return JsonResponse({'error': 'APIのクォータを超えました。しばらくしてから再試行してください。'}, status=429)
        # except client.error.AuthenticationError:
        #     return JsonResponse({'error': 'APIキーが無効です。設定を確認してください。'}, status=401)
        except Exception as e:
            return JsonResponse({'error': 'ChatGPT APIへのリクエスト中にエラーが発生しました。'}, status=500)
    
class RecipeSuggestionView(APIView):
     # このビューに認証を必須にする
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            # 現在ログインしているユーザーの材料を取得
            ingredients = Ingredients.objects.filter(user=request.user)
            ingredient_names = [ingredient.name for ingredient in ingredients]
            saved_recipe=[]
            
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
            
            ※ レシピは最低6つ提案してください。
            ※ 可能な限り所持している材料を活用してください。
            ※ 所持していない材料が必要な場合は、それを補足材料としてリストに含めてください。
            ※ 簡単な説明と手順を具体的に記述してください。調味料も含めてください。
            ※ 必要な材料に調味料などは含めないでください。
            ※ JSON形式でのみ返答してください。不要な文字やフォーマットは一切含めないでください。
            """

            # ChatGPT APIにリクエストを送信
            client = OpenAI(api_key=settings.OEPNAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": ststem_prompt},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=2000,
                temperature=0.8,
            )

            # APIのレスポンスを解析
            recipes_jsondata=json.loads(response.choices[0].message.content)
            # recipes_data=response.choices[0].message.content
            # レスポンス内容をテキストファイルに保存
            file_path = os.path.join(settings.BASE_DIR, "debug_response.txt")
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(response.choices[0].message.content)
                
            for recipe_data in recipes_jsondata:
                recipe=Recipe(
                    user=request.user,
                    name=recipe_data["name"],
                    description=recipe_data["description"],
                    cooking_time=recipe_data["cookingTime"],
                    difficulty=recipe_data["difficulty"]
                )
                #Recipeモデルを保存
                recipe.save()
                
                #ingredientモデルを保存
                for ingredient_name in recipe_data["ingredients"]:
                    Ingredient.objects.create(recipe=recipe,name=ingredient_name)
                
                #Instructionモデルを保存
                for step_number,instruction_text in enumerate(recipe_data["instructions"],start=1):
                    Instruction.objects.create(recipe=recipe,step_number=step_number,description=instruction_text)
                
                #保存したレシピをリストに追加
                saved_recipe.append(recipe)
            
            # 保存したすべてのレシピをシリアライズ
            serializer=RecipeSerializer(saved_recipe,many=True)
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
            logger.debug(f'Received data: {data}')

            ingredients_list = data.get('ingredients', [])

            if not ingredients_list:
                logger.warning('No ingredients provided in the request data')
                return JsonResponse({'message': 'Ingredients are required'}, status=400)

            for ingredient_data in ingredients_list:
                if not ingredient_data.get('name'):
                    logger.warning('Name not provided for an ingredient')
                    return JsonResponse({'message': 'Name is required for each ingredient'}, status=400)

                ingredients = Ingredients(
                    user_id=request.user.id,
                    name=ingredient_data.get('name'),
                    quantity=ingredient_data.get('quantity'),
                    category=ingredient_data.get('category')
                )
                ingredients.save()

            logger.info('All ingredients saved successfully')
            return JsonResponse({'message': 'Ingredients saved successfully!'}, status=201)

        except Exception as e:
            logger.error('An error occurred', exc_info=True)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
class GetIngredientsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated] #ユーザ認証が必要
    serializer_class = IngredientSerializer

    def get_queryset(self):
        return Ingredients.objects.filter(user=self.request.user)
    
class DeleteIngredients(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self,request,pk):
        try:
            Ingredients.objects.get(pk=pk).delete()
            return JsonResponse({'message': '材料が正常に削除されました！'}, status=200)
        except Ingredients.DoesNotExist:
            return JsonResponse({'error': '材料が見つかりません'}, status=404)
        except Exception as e:
            logger.error('エラーが発生しました', exc_info=True)
            return JsonResponse({'error': '内部サーバーエラーが発生しました'}, status=500)
        
class DeleteUseIngredients(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request):
        try:
            recipe_id=request.data.get("recipe_id")
            names=request.data.get("names",[])  # 複数の食材名をリストとして取得
            not_found_items=[]
            
            try:
                recipe=Recipe.objects.get(id=recipe_id)
            except Recipe.DoesNotExist:
                return JsonResponse({'error': 'レシピが見つかりません'}, status=404)
                
            CookHistory.objects.create(
                user=request.user,
                recipe=recipe,
            )
            
            for name in names:
                ingredient = Ingredients.objects.filter(user=request.user, name__icontains=name).first()
                if ingredient:
                    ingredient.delete()
                else:
                    not_found_items.append(name)
                    
            response = {'message': '材料が正常に削除されました！'}
            if not_found_items:
                response['not_found_items'] = not_found_items
                
            return JsonResponse(response, status=200)
        
        except Exception as e:
            logger.error('エラーが発生しました', exc_info=True)
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
            logger.error('エラーが発生しました', exc_info=True)
            return JsonResponse({'error': '内部サーバーエラーが発生しました'}, status=500)

class OCRView(APIView):
    permission_classes = [IsAuthenticated] #ユーザ認証が必要
    def post(self,request,*args,**kwargs):
        #ファイルを取得
        uploaded_file: InMemoryUploadedFile = request.FILES.get('image',None)
        
        if not uploaded_file:
            return Response({"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 画像データをBase64エンコード
            image_data = base64.b64encode(uploaded_file.read()).decode("utf-8")

            # Google Vision APIのURL
            url = f"https://vision.googleapis.com/v1/images:annotate?key={settings.VISION_API_KEY}"

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
                
            # 食材らしい項目を抽出するための正規表現
            pattern = r"^(03|13|01)\*?([^¥]*)"  # 03*, 13*, 01* で始まる商品名を抽出

            # 結果を格納するリスト
            ingredients_list = []

            # テキストを行ごとに分割
            lines = text.split("\n")
            for line in lines:
                match = re.match(pattern, line)
                if match:
                    category = match.group(1)  # 03, 13, 01
                    rest = match.group(2).strip()  # 商品名と数量
                    if " " in rest:  # スペースで分割して数量を抽出
                        name, quantity = rest.rsplit(" ", 1)
                    else:
                        name, quantity = rest, "1個"  # 数量がない場合はデフォルトで1個
                        
                    # type を追加
                    if category == "03":
                        item_type = "vegetable"
                    elif category == "13":
                        item_type = "other"
                    elif category == "01":
                        item_type = "meat"
                    else:
                        item_type = "other"
                    ingredients_list.append({"category": item_type, "name": name, "quantity": quantity})

            for ingredient_data in ingredients_list:
                    if not ingredient_data:
                        logger.warning('Name not provided for an ingredient')
                        return JsonResponse({'message': 'Name is required for each ingredient'}, status=400)

                    ingredients = Ingredients(
                        user_id=request.user.id,
                        name=ingredient_data.get('name'),
                        quantity=ingredient_data.get('quantity'),
                        category=ingredient_data.get('category')
                    )
                    ingredients.save()
                
            return Response({"message": "保存完了しました。" }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

