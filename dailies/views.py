
import os
from django.conf import settings
from django.shortcuts import render
from .models import Project, Capture, upvotes, comments
from django.http import JsonResponse
from django.core import serializers
from django.shortcuts import redirect

from dailies import forms

MEDIA_PATH = settings.MEDIA_ROOT


def return_user_ip(request):
    """ Returns a users IP address. """

    userIP = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '')).split(',')[0].strip()
    return userIP



def dailies_view(request):

    all_projects = Project.objects.all()
    all_captures = Capture.objects.all().order_by('-date_time')
    all_upvotes = upvotes.objects.all()
    all_comments = comments.objects.all()

    user_ip = return_user_ip(request)

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

                comment = write_comment_form.cleaned_data['written_comment']
                daily_id = request.POST.get('daily_id')
                comments().create_comment(request, daily_id, comment)

                return redirect('dailies')


        elif 'set_projects' in request.POST:

            if request.user.is_superuser:

                if submit_daily_form.is_valid():

                    file = submit_daily_form.cleaned_data['file']
                    set_name = submit_daily_form.cleaned_data['set_name']
                    thumbnail = submit_daily_form.cleaned_data['thumbnail']
                    set_projects = submit_daily_form.cleaned_data['set_projects']
                    set_new_project = submit_daily_form.cleaned_data['set_new_project']
                    set_studio = submit_daily_form.cleaned_data['set_studio']
                    set_new_studio = submit_daily_form.cleaned_data['set_new_studio']
                    task_type = submit_daily_form.cleaned_data['task_type']
                    software_used = submit_daily_form.cleaned_data['software_used']
                    status = submit_daily_form.cleaned_data['status']
                    comment = submit_daily_form.cleaned_data['comment']

                    no_ext_name, get_extension = remove_ext(file.name)
                    clean_file_name = no_ext_name[:-1]
                    media_type = get_media_type(get_extension)

                    print("\n----")
                    print(get_extension)
                    print(media_type)
                    print(software_used)

                    if not bool(set_projects):
                        set_projects = set_new_project

                    if bool(set_new_studio) != False:
                        set_studio = set_new_studio  

                    if bool(set_name) != False:
                        clean_file_name = set_name

                    file_dir_path, short_path, version = create_dirs(set_projects, clean_file_name)
                    short_path_full = f"{short_path}/{file.name}"
                    thumbnail_short_path = f"{short_path}/{str(thumbnail)}"

                    file_path = os.path.join(file_dir_path, file.name)
                    thumbnail_path = os.path.join(file_dir_path, str(thumbnail))

                    # Upload the file.
                    with open(file_path, 'wb') as destination:
                        for chunk in file.chunks():
                            destination.write(chunk)

                    # Upload the thumbnail.
                    with open(thumbnail_path, 'wb') as destination:
                        for chunk in thumbnail.chunks():
                            destination.write(chunk)

                    project_obj = Project().create_project(set_projects, set_studio)

                    Capture().create_capture(project_obj, submit_daily_form, 
                                             clean_file_name, short_path_full, 
                                             thumbnail_short_path, version, media_type, software_used)

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



def remove_ext(files_path):
    """ Simply removes the format extension no matter how long it is. """

    ext = str(files_path).split(".")[-1]
    ext_length = len(ext)
    clean_path = str(files_path)[:-ext_length] # Removed extension no matter how long it is or if their is extra "."

    return clean_path, ext



def get_media_type(get_extension):
    """ Returns the type of media. """

    image_types = ["jpg", "JPG", "JPEG", "bmp", "tiff", "ico", "tga", "webp", "icns", "png", "PNG", "gif"]
    video_types = ["mp4", "mov", "flv", "m4v", "avi", "3gp", "mkv", "ts", "asf", "hevc", "wmv", "MP4"]

    if get_extension in image_types:
        media_type = "Image"
    elif get_extension in video_types:
        media_type = "Video"
    else:
        media_type = None

    return media_type



def create_dirs(project_name, file_name):
    """ Makes directories if they do not exist. """

    short_path = f"dailies/projects/{project_name}/{file_name}"

    dailies_dir = f"{MEDIA_PATH}/dailies"
    projects_main_dir = f"{dailies_dir}/projects"
    project_dir = f"{projects_main_dir}/{project_name}"
    file_dir= f"{project_dir}/{file_name}"

    if not os.path.exists(dailies_dir):
        os.mkdir(dailies_dir)

    if not os.path.exists(projects_main_dir):
        os.mkdir(projects_main_dir)

    if not os.path.exists(project_dir):
        os.mkdir(project_dir)

    if not os.path.exists(file_dir):
        os.mkdir(file_dir)
        os.mkdir(f"{file_dir}/v001")

        file_dir = f"{file_dir}/v001"
        short_path = f"dailies/projects/{project_name}/{file_name}/v001"
        version = "v001"

    else:
        versions = os.listdir(file_dir)
        latest_version = (versions[-1])[1:] # Get latest version[-1] and remove the V[1:]

        num_int = int(latest_version)
        num_int += 1
        num_zfill = str(num_int).zfill(len(latest_version))
        new_version = f"v{num_zfill}"

        os.mkdir(f"{file_dir}/{new_version}")

        file_dir = f"{file_dir}/{new_version}"
        short_path = f"{short_path}/{new_version}"
        version = new_version

    



    return file_dir, short_path, version






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