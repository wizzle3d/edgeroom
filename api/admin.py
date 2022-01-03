from django.contrib import admin
from .models import User, Question, Tag, Answer, Comment, Vote, Notification, NotificationChange, NotificationObject

# Register your models here.
admin.site.register(User)
admin.site.register(Question)
admin.site.register(Tag)
admin.site.register(Answer)
admin.site.register(Comment)
admin.site.register(Vote)
admin.site.register(Notification)
admin.site.register(NotificationObject)
admin.site.register(NotificationChange)
