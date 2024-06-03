from django import forms
from .models import *


class AnimeForm(forms.ModelForm):
    """
    A form for creating or updating an Anime instance.

    This form includes a multiple choice field for selecting genres.

    Attributes:
        genres (forms.ModelMultipleChoiceField): A field for selecting multiple genres.
            It is rendered as a checkbox select multiple widget.
        Meta (class): Inner class that defines metadata options for the form.

    """

    genres = forms.ModelMultipleChoiceField(
        queryset=Genre.objects.all(), widget=forms.CheckboxSelectMultiple, required=True
    )

    class Meta:
        model = Anime
        fields = "__all__"


class AnimeCollectionForm(forms.ModelForm):
    """
    A form for adding anime collection.

    This form is used to add a new entry to the UsersAnime model, which represents a user's anime collection.
    It provides fields for selecting the user, anime, status, score, and favorite status.

    Attributes:
        model (Model): The model class to use for the form.
        fields (list or '__all__'): The fields to include in the form.
        widgets (dict): A dictionary of widget instances to use for the form fields.

    Methods:
        create(validated_data): Creates a new UsersAnime instance with the provided validated data.

    """

    class Meta:
        model = UsersAnime
        fields = "__all__"
        widgets = {
            "user": forms.Select(),
            "anime": forms.Select(),
            "status": forms.Select(choices=UsersAnime.ANIME_STATE),
            "score": forms.Select(choices=UsersAnime.SCORE_CHOICES),
            "is_favorite": forms.CheckboxInput(),
        }

    def create(self, validated_data):
        """
        Create a new UsersAnime instance with the provided validated data.

        Args:
            validated_data (dict): The validated data from the form.

        Returns:
            UsersAnime: The newly created UsersAnime instance.

        """
        anime = UsersAnime.objects.create(**validated_data)
        return anime


class ReviewsForm(forms.ModelForm):
    """
    A form for adding reviews.

    This form is used to create and validate reviews for anime.

    Attributes:
        model (Model): The model class associated with the form.
        fields (list or '__all__'): The fields to include in the form.
        widgets (dict): A dictionary of widget instances for form fields.

    Methods:
        create(validated_data): Creates a new review object based on the validated data.

    """

    class Meta:
        model = UsersAnime
        fields = "__all__"
        widgets = {
            "user": forms.Select(),
            "anime": forms.Select(),
            "review": forms.Textarea(),
        }

    def create(self, validated_data):
        """
        Create a new review object.

        Args:
            validated_data (dict): The validated data from the form.

        Returns:
            review (UsersAnime): The newly created review object.

        """
        review = UsersAnime.objects.create(**validated_data)
        return review


class GenreForm(forms.ModelForm):
    """
    A form for creating or updating a Genre.

    This form is used to handle the input data for creating or updating a Genre object.

    Attributes:
        model (Genre): The Genre model that this form is associated with.
        fields (list): The list of fields to include in the form.

    """

    class Meta:
        model = Genre
        fields = ["name"]


class CreatePostForm(forms.ModelForm):
    """
    A form used for creating a new Post object.

    This form is used to validate and handle the data submitted for creating a new Post.
    It is based on the Post model and includes all fields defined in the model.

    Attributes:
        model (Post): The model class associated with this form.
        fields (str): A string specifying the fields to include in the form.
        widgets (dict): A dictionary specifying the widgets to use for each form field.

    Methods:
        create(validated_data): Creates a new Post object with the validated data.

    """

    class Meta:
        model = Post
        fields = "__all__"
        widgets = {
            "user": forms.Select(),
            "title": forms.TextInput(),
            "content": forms.Textarea(),
        }

    def create(self, validated_data):
        """
        Create a new Post object with the validated data.

        Args:
            validated_data (dict): A dictionary containing the validated form data.

        Returns:
            Post: The newly created Post object.

        """
        post = Post.objects.create(**validated_data)
        return post


class CreateCharacterForm(forms.ModelForm):
    """
    A form for creating a new character.

    This form is used to create a new character by providing the necessary information.

    Attributes:
        model (django.db.models.Model): The model class associated with the form.
        fields (str or list): The fields to include in the form.
        widgets (dict): A dictionary of widget instances to use for form fields.

    Example:
        form = CreateCharacterForm()
    """

    class Meta:
        model = Characters
        fields = "__all__"
        widgets = {
            "img": forms.FileInput(attrs={"accept": "image/*"}),
        }


class CreateVoiceActorForm(forms.ModelForm):
    """
    A form used for creating a new VoiceActor instance.

    This form is used to collect and validate data for creating a new VoiceActor object.
    It is based on the VoiceActor model and includes all fields defined in the model.

    Attributes:
        model (class): The model class associated with the form.
        fields (str or list): The fields to include in the form.
        widgets (dict): A dictionary of widget instances to use for form fields.

    Example:
        form = CreateVoiceActorForm()
        if form.is_valid():
            voice_actor = form.save()
    """

    class Meta:
        model = VoiceActor
        fields = "__all__"
        widgets = {
            "img": forms.FileInput(attrs={"accept": "image/*"}),
        }
