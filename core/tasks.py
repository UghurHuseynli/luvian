from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.conf import settings

@shared_task
def send_task(subject, message, email):
    print(settings.EMAIL_HOST_USER)
    email = EmailMultiAlternatives(
        subject,
        strip_tags(message),
        settings.EMAIL_HOST_USER,
        [email]
    )

    email.attach_alternative(message, 'text/html')
    email.send()
    return 'ok'

