from django import forms


class CommentForm(forms.Form):
    
    author_attributes = {"class": "form-control",
                        "placeholder": "Your Name"}

    author = forms.CharField(max_length=60,
                            widget=forms.TextInput(attrs=author_attributes))

    body_attributes = {"class": "form-control",
                        "placeholder": "Leave a comment!"}

    body = forms.CharField(widget=forms.Textarea(attrs=body_attributes))


    