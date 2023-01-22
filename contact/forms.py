from django import forms
from django.core.exceptions import ValidationError
# from captcha.fields import ReCaptchaField

class ContactForm(forms.Form):

    yourname = forms.CharField(max_length=100, label='Your Name')
    postbox = forms.EmailField(required=True, label='Your e-mail address')
    subject = forms.CharField(max_length=100)
    message = forms.CharField(widget=forms.Textarea)



