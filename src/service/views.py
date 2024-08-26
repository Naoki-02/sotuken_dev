from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from openai import OpenAI


class ChatGPTView(View):
    def post(self, request, *args, **kwargs):
        client=OpenAI(api_key=settings.OEPNAI_API_KEY)
        user_message = request.POST.get('message')

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message},
            ],
        )

        gpt_response = response.choices[0].message['content']
        return JsonResponse({'response': gpt_response})

    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')
