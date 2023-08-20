from django import forms
from .models import Project, Capture, upvotes, comments
from django.core.exceptions import ValidationError
import os

class WriteComment(forms.Form):

    written_comment = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Write a comment.'}), required=False)


class SubmitDaily(forms.Form):

    file = forms.FileField(
        label='File',
    )

    set_name= forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Set new name or leave blank.'}), required=False)


    # Set Thumbnail
    thumbnail = forms.ImageField(label="Thumbnail", required=False,)

    # Set Project
    set_projects = forms.ChoiceField(
        choices=[],
        widget=forms.Select(attrs={'class': 'dropdown-class'}),
        label='Projects',
        required=False
    )

    set_new_project = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Add a new project or leave blank.'}), required=False)


    # Set Studio
    set_studio = forms.ChoiceField(
        choices=[],
        widget=forms.Select(attrs={'class': 'dropdown-class'}),
        label='Studio',
        required=False
    )

    set_new_studio = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'Add a new studio or leave blank.'}), required=False)


    # Task Typer
    TASK_TYPE = [
        ('anim', 'anim'),
        ('rig', 'rig'),
        ('mod', 'mod'),
        ('previs', 'previs'),
        ('edit', 'edit'),
        ('all', 'all'),
    ]
    task_type = forms.ChoiceField(
        choices= TASK_TYPE,
        widget=forms.Select(attrs={'class': 'dropdown-class'}),
        label='Task Type',
        required=False
    )



    #  Software used
    SOFTWARE_USED = [
        ('Maya', 'Maya'),
        ('Houdini', 'Houdini'),
        ('Blender', 'Blender'),
        ('3DS max', '3DS max'),
        ('SubstancePainter', 'SubstancePainter'),
        ('AfterEffects', 'AfterEffects'),
        ('PhotoShop', 'PhotoShop'),
        ('Vray', 'Vray'),

    ]
    software_used = forms.MultipleChoiceField(
        choices= SOFTWARE_USED,
        widget=forms.SelectMultiple(attrs={'class': 'dropdown-class'}),
        label='Software Used',
        required=False
    )



    # Task Typer
    STATUS = [
        ('wip', 'wip'),
        ('done', 'done'),
        ('incomplete', 'incomplete'),
        ('None', 'None'),
    ]
    status = forms.ChoiceField(
        choices= STATUS,
        widget=forms.Select(attrs={'class': 'dropdown-class'}),
        label='Status',
        required=False
    )


    
    # Add Comment
    comment = forms.CharField(
        label='',
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Write a comment.'})
    )


    def __init__(self, *args, **kwargs):
        super(SubmitDaily, self).__init__(*args, **kwargs)
        self.fields['set_projects'].choices = self.get_existing_projects()
        self.fields['set_studio'].choices = self.get_existing_studios()   


    def get_existing_projects(self):
        existing_projects = Project.objects.all().values_list('project_name', 'project_name')
        choices = [('', '--- Select a project ---')] + list(existing_projects)
        return choices
    

    def get_existing_studios(self):
        existing_studio = Project.objects.all()

        count = 0
        studio_list = []
        studio_list_dup = []

        for i in existing_studio:

            # Keep Duplicates out.
            if i.studio_name not in studio_list_dup:

                count += 1
                studio_list_dup.append(i.studio_name)
                studio_list.append((i.studio_name, i.studio_name))

        choices = [('', '--- Select a studio ---')] + list(studio_list)

        return choices
    




    


        
