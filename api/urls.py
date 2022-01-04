from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from . import views


urlpatterns = [
    path("test/", views.test, name="test"),
    path("create-user/", views.create_user, name="create-user"),
    path("get-user/<int:id>", views.get_user, name="get-user"),
    path("get-users/", views.get_users, name="get-users"),
    path("get-notifications/", views.get_notifications, name="get-notifications"),
    path("edit-notifications/<int:id>", views.edit_notifications, name="edit-notifications"),
    path("check-notifications/", views.check_notifications, name="check-notifications"),
    path("edit-profile/", views.edit_profile, name="edit-profile"),
    path("edit-avatar/", views.edit_avatar, name="edit-avatar"),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("get-questions/", views.get_all_questions, name="get-questions"),
    path("get-question/<int:id>", views.get_question, name="get-question"),
    path("get-tags/", views.get_tags, name="get-tags"),
    path("get-tag/<str:name>", views.get_tag, name="get-tag"),
    path("create-question/", views.create_question, name="create-question"),
    path("mark-answer/<int:question_id>", views.mark_answer, name="mark-answer"),
    path("get-user-questions/", views.get_user_questions, name="get-user-questions"),
    path("post-answer/<int:id>", views.post_answer, name="post-answer"),
    path("create-comment/<int:id>", views.create_comment, name="create-comment"),
    path("search/<str:query>", views.search, name="search"),
    path("search-tags/<str:name>", views.search_tags, name="search-tags"),
    path("create-tag/", views.create_tag, name="create-tag"),
    path("vote/<int:id>", views.vote, name="vote"),
]
