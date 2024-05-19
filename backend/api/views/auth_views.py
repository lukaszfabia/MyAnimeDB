from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import generics

from api.user_serializers import UserProfileSerializer
from api.models import UserProfile


class RegistrationView(generics.CreateAPIView):
    """Register a user in the database"""

    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, JSONParser]  # czy to jest potrzebne?

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = request.data.get("user.email")
            if email is None or UserProfile.objects.filter(user__email=email).exists():
                return Response(
                    {"error": "User with this email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            serializer.save()
            return Response(
                {
                    "message": "User registered successfully",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SettingsView(generics.UpdateAPIView):
    """Change users profile information"""

    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def get_object(self):
        return self.request.user.profile

    def put(self, request, *args, **kwargs):
        print("pucik")
        return self.partial_update(request, *args, **kwargs)
