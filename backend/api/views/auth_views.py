from django.http import QueryDict
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import generics

from api.user_serializers import UserProfileSerializer
from api.models import UserProfile
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail


class RegistrationView(generics.CreateAPIView):
    """Register a user in the database"""

    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, JSONParser]

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
        return self.partial_update(request, *args, **kwargs)


# User = get_user_model()


class CustomPasswordResetView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")

        if email is None:
            return Response(
                {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(UserProfile, user__email=email).user

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        send_mail(
            html_message=f"Hello {user.username}!, Click <a href='http://localhost:5173/login/forgot-password/{uid}/{token}'>here</a> to reset your password",
            from_email="admin@localhost",
            recipient_list=[email],
            subject="Password reset",
            message="Password reset",
        )

        return Response(
            {"message": "Password reset email has been sent"}, status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        uid = urlsafe_base64_decode(request.data.get("uid"))
        token = request.data.get("token")

        user = get_object_or_404(get_user_model(), pk=uid)

        if default_token_generator.check_token(user, token):
            password = request.data.get("new_password")
            user.set_password(password)
            user.save()
            return Response(
                {"message": "Password has been reset"}, status=status.HTTP_200_OK
            )

        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
