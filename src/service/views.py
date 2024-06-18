from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.
def index(request):
    return render(request, 'index.html')

class GetAPIView(APIView):
    def get(self, request):
        return Response({'message': 'Hello, React'})
    

class PostAPIView(APIView):
    def post(self, request,*args, **kwargs):
        message= request.data.get('message')
        if message:
            return Response({'message': message},status=status.HTTP_200_OK)
        return Response({"error":"No message found"},status=status.HTTP_400_BAD_REQUEST)
        