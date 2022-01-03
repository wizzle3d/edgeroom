from rest_framework import serializers
from .models import User, Question, Tag, Answer, Comment, Vote, NotificationChange, NotificationObject, Notification
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class TagSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Tag
        fields = ("name", "description", "id", "questions")


class UserSerializer(serializers.ModelSerializer):
    interests = TagSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ("id", "username", "avatar", "interests")


class NotificationChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationChange
        fields = ["id", "is_seen", "action_type", "actionID", "created"]


class NotificationObjectSerializer(serializers.ModelSerializer):
    change = NotificationChangeSerializer(many=True, read_only=True)
    class Meta:
        model = NotificationObject
        fields = ["id", "entity_type", "entity", "parent", "change"]


class NotificationSerializer(serializers.ModelSerializer):
    obj = NotificationObjectSerializer(many=True, read_only=True)
    class Meta:
        model = Notification
        fields = ["id", "obj", "receiverID"]


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer()
    class Meta:
        model = Comment
        fields = "__all__"


class VoteSerializer(serializers.ModelSerializer):
    likes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    dislikes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Vote
        fields = ["id", "likes", "dislikes"]


class AnswerSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True)
    author = UserSerializer()
    vote = VoteSerializer()
    class Meta:
        model = Answer
        fields = ["id", "author", "question", "body", "is_solution", "created", "updated", "comments", "vote"]


class TagSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Tag
        fields = ("name", "description", "id", "questions")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "avatar")


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True)
    host = UserSerializer()
    comments = CommentSerializer(many=True)
    vote = VoteSerializer()
    class Meta:
        model = Question
        fields = ["id", "host", "tags", "title", "updated", "comments", "created", "views", "is_answered", "description", "answers", "vote"]


class AnswerQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "title"]


class ProfileAnswerSerializer(serializers.ModelSerializer):
    question = AnswerQuestionSerializer()
    class Meta:
        model = Answer
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    interests = TagSerializer(many=True)
    answers = ProfileAnswerSerializer( many=True, read_only=True)
    questions = QuestionSerializer( many=True, read_only=True)
    class Meta:
        model = User
        fields = ("id", "username", "avatar", "date_joined", "questions",  "last_login", "bio", "interests", "answers")

