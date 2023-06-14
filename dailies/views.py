
import os
from django.conf import settings
from django.shortcuts import render
from .models import Project, Capture, upvotes, comments
from django.http import JsonResponse
from django.core import serializers
from django.shortcuts import redirect

from dailies import forms

from dailies import utils

MEDIA_PATH = settings.MEDIA_ROOT





def dailies_view(request):
    """ Render dailies views. """

    all_projects = Project.objects.all()
    all_captures = Capture.objects.all().order_by('-date_time')
    all_upvotes = upvotes.objects.all()
    all_comments = comments.objects.all()

    user_ip = utils.return_user_ip(request)

    if request.method == "GET":

        write_comment_form = forms.WriteComment()
        submit_daily_form = forms.SubmitDaily()

        context = {"all_projects": all_projects,
                "all_captures": all_captures,
                "all_upvotes": all_upvotes,
                "all_comments": all_comments,
                'write_comment_form' : write_comment_form, 
                "submit_daily_form": submit_daily_form,
                "user_ip": user_ip,
                }
    
        return render(request, 'dailies_view.html', context)
        
    else:
        write_comment_form = forms.WriteComment(request.POST)
        submit_daily_form = forms.SubmitDaily(request.POST, request.FILES)

        if 'written_comment' in request.POST:
            if write_comment_form.is_valid():

                utils.add_user_comment(write_comment_form, request)
                return redirect('dailies')


        elif 'set_projects' in request.POST:            
            if request.user.is_superuser:
                if submit_daily_form.is_valid():

                    utils.create_daily(submit_daily_form)
                    return redirect("dailies")

            else:
                return redirect("dailies")

        context = {"all_projects": all_projects,
                    "all_captures": all_captures,
                    "all_upvotes": all_upvotes,
                    "all_comments": all_comments,
                    'write_comment_form' : write_comment_form,
                    "submit_daily_form": submit_daily_form
        }
    
        return render(request, 'dailies_view.html', context)






def ajax_return_data(request):
    """ Return data for selected capture. """

    if request.method == 'GET':

        id = request.GET.get("id")

        dailied_file = Capture.objects.get(pk=id)
        post_comments = comments.objects.filter(post=dailied_file)

        captured_serialized_file = serializers.serialize('json', [dailied_file])
        studio_serialized_file = serializers.serialize('json', [dailied_file.project])
        comments_serialized_file = serializers.serialize('json', post_comments)

        context = {"captures": captured_serialized_file,
                   "studio": studio_serialized_file,
                   "comments":comments_serialized_file
                   }
        
        return JsonResponse(context)




def ajax_add_vote(request):
    """ Return data for selected project. """

    if request.method == 'GET':

        id = request.GET.get("id")
        upvotes().add_new_vote(request, id)

        return JsonResponse({})
    



def ajax_remove_comment(request):
    """ Return data for selected project. """

    if request.method == 'GET':

        id = request.GET.get("id")
        comments().remove_comment(request, id)

        return JsonResponse({"success": True})