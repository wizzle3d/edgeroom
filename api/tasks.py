from celery import shared_task
from celery.utils.log import get_task_logger
from django.contrib.auth import get_user_model
import time
from django.conf import settings
from django.core.mail import send_mail


User = get_user_model()
logger = get_task_logger(__name__)



@shared_task()
def send_reg_email(email: str) -> None:
    user = User.objects.get(email=email)
    user.generate_verification_token()
    token = user.verification_token
    verification_link = f"{settings.HOSTNAME}/api/verify/{token.key}/"
    subject = "Welcome to Edgeroom"
    logger.info("Verification email sent")
    body = f"Thank you for signing up with Edgeroom, Please click on this link {verification_link} to confirm your email address."
    sender = "hi@edgeroom.com"
    result = send_mail(subject, body, sender, [email])
    print(result)
    token.sent = True
    token.save()

@shared_task()
def testii():
    print("Testing")
    return "Done"