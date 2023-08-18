from django import forms
from .models import LeaderBoard
from django.core.exceptions import ValidationError

from game import game_utils


COUNTRIES_LIST = game_utils.get_country_list()

class save_leaderBoard(forms.Form):

    
    username = forms.CharField(label='What is your Name or Username?', widget=forms.TextInput(attrs={'placeholder': 'Add your Username or Name.'}), required=True)
    comment = forms.CharField(
        label='Add a comment or feedback! (optional)',
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Write a comment or feedback.'})
    )


    COUNTRIES_DICT = dict(COUNTRIES_LIST)

    country = forms.ChoiceField(
        choices=COUNTRIES_LIST,
        widget=forms.Select(attrs={'class': 'dropdown-class'}),
        label='Where are you from? (optional)',
        required=False
    )

    form_points = forms.CharField(widget=forms.HiddenInput(), required=False)
    form_zombie_deaths = forms.CharField(widget=forms.HiddenInput(), required=False)
    form_time_elapsed = forms.CharField(widget=forms.HiddenInput(), required=False)
    form_rank = forms.CharField(widget=forms.HiddenInput(), required=False)

    email = forms.EmailField(widget=forms.HiddenInput(), required=False)