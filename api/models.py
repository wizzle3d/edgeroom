from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser





class Tag(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    description = models.CharField(max_length=1000, null=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    name = models.CharField(max_length=200)
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=250, null=True)
    avatar = models.CharField(max_length=150, default='https://res.cloudinary.com/wizzle3d/'
                                                      'image/upload/v1637699597/vaito/default_ni4q8g.jpg')
    interests = models.ManyToManyField(Tag)

    REQUIRED_FIELDS = []


class Question(models.Model):
    host = models.ForeignKey(User, related_name='questions', on_delete=models.SET_NULL, null=True)
    tags = models.ManyToManyField(Tag, related_name='questions')
    title = models.CharField(max_length=400)
    description = models.JSONField(null=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    views = models.IntegerField(default=0)
    is_answered = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Answer(models.Model):
    author = models.ForeignKey(User, related_name='answers', on_delete=models.SET_NULL, null=True)
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.SET_NULL, null=True)
    body = models.JSONField(null=True)
    is_solution = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)


class Vote(models.Model):
    question = models.OneToOneField(Question, related_name='vote', on_delete=models.CASCADE, null=True)
    answer = models.OneToOneField(Answer, related_name='vote', on_delete=models.CASCADE, null=True)
    likes = models.ManyToManyField(User, related_name='likes')
    dislikes = models.ManyToManyField(User, related_name='dislikes')

    @property
    def entity(self):
        return self.answer or self.question

    @entity.setter
    def entity(self, obj):
        if type(obj) == Question:
            self.question = obj
            self.answer = None
        elif type(obj) == Answer:
            self.question = None
            self.answer = obj
        else:
            raise ValueError("obj parameter must be an object of type Question or Answer.")




class Comment(models.Model):
    author = models.ForeignKey(User, related_name="comments", on_delete=models.SET_NULL, null=True)
    question = models.ForeignKey(Question, related_name="comments", on_delete=models.CASCADE, null=True)
    answer = models.ForeignKey(Answer, related_name="comments", on_delete=models.CASCADE, null=True)
    body = models.CharField(max_length=400)
    created = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    receiverID = models.IntegerField(null=True, unique=True)
    unseen_count = models.IntegerField(default=0)


class NotificationObject(models.Model):
    notification = models.ForeignKey(Notification, related_name="obj", on_delete=models.CASCADE, null=True)
    # entity_type: "answer" or "question"...
    entity_type = models.CharField(max_length=30, default="question")
    entity = models.JSONField(null=True)
    # parent applicable only if entity is of type "answer"
    parent = models.JSONField(null=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated']


class NotificationChange(models.Model):
    notification_object = models.ForeignKey(NotificationObject, related_name="change", on_delete=models.CASCADE, null=True)
    actor = models.ForeignKey(User, on_delete=models.CASCADE)
    is_seen = models.BooleanField(default=False)
    # action performed on entity, type: "answer" or "comment"
    action_type = models.CharField(max_length=30, default="comment")
    actionID = models.IntegerField(null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.actor.name + self.action_type
