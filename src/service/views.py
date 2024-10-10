import json

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
from openai import OpenAI

from .models import Ingredients


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
    
    
class IngredientsView(View):
    def post(self, request, *args, **kwargs):
        try:
            # name = request.POST.get('name') #フロントからのリクエストを取得
            # quantity = request.POST.get('quantity') #フロントからのリクエストを取得
            # category =request.POST.get('category') #フロントからのリクエストを取得
            
            #JSONからデータを取得
            data = json.loads(request.body)
            name = data.get('name')
            quantity = data.get('quantity')
            category = data.get('category')
            
            #データがすべて入っているか確認
            if not name:
                return JsonResponse({'message': 'Name is required'}, status=400)
            
            #モデルに保存
            ingredients = Ingredients(
                name=name,
                quantity=quantity,
                category=category
            )
            ingredients.save() #保存
            
            return JsonResponse({'message': 'Ingredients saved successfully!'}, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    
