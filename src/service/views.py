import json
import logging

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
from openai import OpenAI
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ingredients
from .serializers import IngredientSerializer

logger = logging.getLogger('myapp')

class ChatGPTView(View):
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

    def get(self, request, *args, **kwargs):
        return render(request, 'index.html') #index.htmlを返す
    
    
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
