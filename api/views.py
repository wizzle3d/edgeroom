from .serializers import UserSerializer, MyTokenObtainPairSerializer, QuestionSerializer, TagSerializer, \
    AnswerSerializer, ProfileSerializer, NotificationSerializer
from rest_framework import status
from datetime import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import User, Question, Tag, Answer, Comment, Vote, Notification, NotificationChange, NotificationObject
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from django.utils import timezone
from .tasks import send_reg_email, testii

datetime.now(tz=timezone.utc)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def create_user(request):
    email = request.data['email']
    username = request.data['username']
    if User.objects.filter(username__iexact=username):
        return Response({"username": "This username has already been taken."}, status=status.HTTP_400_BAD_REQUEST)
    elif User.objects.filter(email=email.lower()):
        return Response({"email": "This email has already been used."}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create(username=request.data['username'].lower(),
                               email=request.data['email'].lower(),
                               name=request.data['name'],)
    user.set_password(request.data['password'])
    user.save()
    notification = Notification.objects.create(receiverID=user.id)
    notification.save()
    send_reg_email.delay(user.email)
    return Response({'message': f"Your account has been created."}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user(request, id):
    user = User.objects.get(id=id)
    if request.user == user:
        res = ProfileSerializer(user).data
        new_res = {**res, "name": f"{user.name}"}
        return Response(new_res,  status=status.HTTP_200_OK)
    return Response(ProfileSerializer(user).data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    return Response(ProfileSerializer(users, many=True).data, status=status.HTTP_200_OK)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_avatar(request):
    user = request.user
    user.avatar = request.data['avatar']
    user.save()
    return Response(status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    user = request.user
    username = request.data['username']
    if user.username != username and User.objects.filter(username__iexact=username):
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    user.username = username
    user.bio = request.data['bio']
    user.name = request.data['name']
    interests = request.data['interests']
    user.save()
    if len(interests) > 0:
        user.interests.clear()
        for interest in interests:
            tag = Tag.objects.get(id=interest['id'])
            user.interests.add(tag)
    return Response(ProfileSerializer(user).data, status=status.HTTP_200_OK)





@api_view(['GET'])
def get_all_questions(request):
    questions = Question.objects.all()
    return Response(QuestionSerializer(questions, many=True).data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_question(request, id):
    question = Question.objects.get(id=id)
    question.views += 1
    question.save()
    return Response(QuestionSerializer(question).data, status=status.HTTP_200_OK)


@api_view(['GET'])
def search(request, query):
    questions = Question.objects.filter(title__icontains=query)
    users = User.objects.filter(username__icontains=query)
    tags = Tag.objects.filter(name__icontains=query)
    res = {"questions": QuestionSerializer(questions, many=True).data,
           "users": UserSerializer(users, many=True).data,
           "tags": TagSerializer(tags, many=True).data}
    return Response(res, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_questions(request):
    user = request.user
    questions = user.questions.all()
    return Response(QuestionSerializer(questions, many=True).data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_question(request):
    user = request.user
    title = request.data['input']
    description = request.data['description']
    tags = request.data['tags']
    question = Question.objects.create(host=user, title=title, description=description)
    question.save()
    if len(tags) > 0:
        for tag in tags:
            tagg = Tag.objects.get(id=tag['id'])
            question.tags.add(tagg)
    vote = Vote.objects.create(question=question)
    vote.save()
    return Response({"message": "Question created successfully."}, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def mark_answer(request, question_id):
    user = request.user
    answer_id = request.data['answer_id']
    question = Question.objects.get(id=question_id)
    answer = Answer.objects.get(id=answer_id)
    if user.id == question.host.id:
        question.is_answered = True
        answer.is_solution = True
        question.save()
        answer.save()
        if answer.author.id != user.id:
            notification = Notification.objects.get(receiverID=answer.author.id)
            entity = {"id": answer.id}
            if NotificationObject.objects.filter(notification=notification, entity=entity):
                noteObj = NotificationObject.objects.get(notification=notification, entity=entity)
            else:
                noteObj = NotificationObject.objects.create(entity_type="answer", entity=entity, notification=notification, parent={"id": question.id, "title": question.title})
                noteObj.save()
            notification_change = NotificationChange.objects.create(notification_object=noteObj, actor=user, action_type="solution")
            notification_change.save()
            notification.unseen_count += 1
            notification.save()
        return Response(QuestionSerializer(question).data, status=status.HTTP_200_OK)
    return Response({"message": "You can't perform this operation"}, status=status.HTTP_403_FORBIDDEN)



@api_view(['GET'])
def get_tags(request):
    tags = Tag.objects.all()
    serializer = TagSerializer(tags, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_tag(request):
    name = request.data['tagName']
    description = request.data['description']
    if Tag.objects.filter(name__iexact=name.lower()):
        return Response({"error": "Tag already exist"}, status=status.HTTP_400_BAD_REQUEST)
    tag = Tag.objects.create(name=name.lower(), description=description)
    tag.save()
    return Response({"message": "Tag created"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_tag(request, name):
    tag = Tag.objects.get(name=name)
    questions = QuestionSerializer(tag.questions, many=True).data
    serializer = TagSerializer(tag).data
    res = {**serializer, "questions": questions}
    return Response(res, status=status.HTTP_200_OK)


@api_view(['GET'])
def search_tags(request, name):
    tag = Tag.objects.filter(name__icontains=name)
    serializer = TagSerializer(tag, many=True).data
    return Response(serializer, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_answer(request, id):
    user = request.user
    question = Question.objects.get(id=id)
    body = request.data['input']
    answer = Answer.objects.create(body=body, author= user, question=question)
    answer.save()
    vote = Vote.objects.create(answer=answer)
    vote.save()
    if question.host.id != user.id:
        notification = Notification.objects.get(receiverID=question.host.id)
        entity = {"id": question.id, "title": question.title}
        if NotificationObject.objects.filter(notification=notification, entity=entity):
            noteObj = NotificationObject.objects.get(notification=notification, entity=entity)
        else:
            noteObj = NotificationObject.objects.create(entity_type="question", entity={"id": question.id, "title": question.title}, notification=notification)
            noteObj.save()
        notification_change = NotificationChange.objects.create(notification_object=noteObj, actor=user, action_type="answer", actionID=answer.id)
        notification_change.save()
        notification.unseen_count += 1
        notification.save()
    return Response(QuestionSerializer(question).data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, id):
    user = request.user
    body = request.data['input']
    type_is_question = request.data['type_is_question']
    comment = Comment.objects.create(author=user, body=body)
    if type_is_question:
        question = Question.objects.get(id=id)
        comment.question = question
        comment.save()
        if user.id != question.host.id:
            notification = Notification.objects.get(receiverID=question.host.id)
            entity = {"id": question.id, "title": question.title}
            if NotificationObject.objects.filter(notification=notification, entity=entity):
                noteObj = NotificationObject.objects.get(notification=notification, entity=entity)
            else:
                noteObj = NotificationObject.objects.create(entity_type="question", entity=entity, notification=notification)
                noteObj.save()
            notification_change = NotificationChange.objects.create(notification_object=noteObj, actor=user, action_type="comment", actionID=comment.id)
            notification_change.save()
            notification.unseen_count += 1
            notification.save()
        return Response(QuestionSerializer(question).data, status=status.HTTP_200_OK)
    else:
        questionID = request.data['questionID']
        question = Question.objects.get(id=questionID)
        answer = Answer.objects.get(id=id)
        comment.answer = answer
        comment.save()
        if user.id != answer.author.id:
            notification = Notification.objects.get(receiverID=answer.author.id)
            entity = {"id": answer.id}
            if NotificationObject.objects.filter(notification=notification, entity=entity):
                noteObj = NotificationObject.objects.get(notification=notification, entity=entity)
            else:
                noteObj = NotificationObject.objects.create(entity_type="answer", entity=entity, notification=notification, parent={"id": questionID, "title": question.title })
                noteObj.save()
            notification_change = NotificationChange.objects.create(notification_object=noteObj, actor=user, action_type="comment", actionID=comment.id)
            notification_change.save()
            notification.unseen_count += 1

            notification.save()
        return Response(AnswerSerializer(answer).data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    user = request.user
    notification = Notification.objects.get(receiverID=user.id)
    return Response(NotificationSerializer(notification).data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_notifications(request):
    user = request.user
    user.last_login = timezone.now()
    user.save()
    notification = Notification.objects.get(receiverID=user.id)
    return Response({"unseen_count": notification.unseen_count}, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_notifications(request, id):
    changes = request.data
    user = request.user
    notification = Notification.objects.get(receiverID=user.id)
    notification_object = NotificationObject.objects.get(id=id)
    if user.id == notification_object.notification.receiverID:
        for change in changes:
            notification_change = NotificationChange.objects.get(id=change['id'])
            notification_change.is_seen = True
            notification_change.save()
            notification.unseen_count -= 1
            notification.save()
        return Response({"unseen_count": notification.unseen_count}, status=status.HTTP_200_OK)
    return Response({"message": "Forbidden request"}, status=status.HTTP_403_FORBIDDEN)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def vote(request, id):
    user = request.user
    value = request.data['value']
    type_is_question = request.data['type_is_question']
    if type_is_question:
        entity = Question.objects.get(id=id)
        vote = Vote.objects.get(question=entity)
    else:
        entity = Answer.objects.get(id=id)
        vote = Vote.objects.get(answer=entity)
    if value:
        if user in vote.likes.all():
            vote.likes.remove(user)
        elif user in vote.dislikes.all():
            vote.dislikes.remove(user)
            vote.likes.add(user)
        else:
            vote.likes.add(user)
        vote.save()
    else:
        if user in vote.dislikes.all():
            vote.dislikes.remove(user)
        elif user in vote.likes.all():
            vote.likes.remove(user)
            vote.dislikes.add(user)
        else:
            vote.dislikes.add(user)
        vote.save()

    if type_is_question:
        return  Response(QuestionSerializer(entity).data, status=status.HTTP_200_OK)
    elif not type_is_question:
        return Response(AnswerSerializer(entity).data, status=status.HTTP_200_OK)


@api_view(["GET"])
def test(request):

    send_reg_email.delay("wizzle3d@gmail.com")

    return Response({"msg": "done"}, status=status.HTTP_200_OK)