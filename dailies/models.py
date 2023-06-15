import uuid
from django.db import models
from django.contrib.auth.models import User

from datetime import datetime, timedelta
from django.db import IntegrityError

class Project(models.Model):

    project_name = models.CharField(max_length=100, null=True, blank=True)
    studio_name = models.CharField(max_length=100, null=True, blank=True)
    date_time = models.DateTimeField(null=True, blank=True)
    order = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.project_name
    
    def create_project(self, project_name, studio_name):
        """ Returns project or Creates a new one if it does not exist. """

        project_exists = Project.objects.filter(project_name=project_name)

        if project_exists.exists() != True:

            self.project_name = project_name
            self.studio_name = studio_name
            self.save()

        project = Project.objects.get(project_name=project_name)

        return project





class Capture(models.Model):

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project')
    capture_name = models.CharField(max_length=100, null=True, blank=True)
    version = models.CharField(max_length=10, null=True, blank=True)
    description = models.CharField(max_length=100, null=True, blank=True)
    media_type = models.CharField(max_length=100, null=True, blank=True)
    software_used = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=100, null=True, blank=True)
    task_type = models.CharField(max_length=100, null=True, blank=True)
    upvotes = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    date_time = models.DateTimeField(null=True, blank=True)

    path_to_capture = models.CharField(max_length=500, null=True, blank=True)
    path_to_thumbnail = models.ImageField(null=True, blank=True)


    def __str__(self):
        return self.capture_name
    

    def create_capture(self, project_obj, submit_daily_form, 
                       clean_file_name, file_path, thumbnail_path, version, media_type, software_used):
        """ Creates a capture in the databse. """

        task_type = submit_daily_form.cleaned_data['task_type']
        status = submit_daily_form.cleaned_data['status']
        comment = submit_daily_form.cleaned_data['comment']

        self.project = project_obj
        self.capture_name = clean_file_name
        self.version = version
        self.description = comment
        self.media_type = media_type
        self.software_used = software_used
        self.status = status
        self.task_type = task_type
        self.date_time = datetime.now()
        self.path_to_capture = file_path
        self.path_to_thumbnail = thumbnail_path

        self.save()

    


class upvotes(models.Model):

    UUID = models.UUIDField(default=uuid.uuid4, editable=False)
    user_ip = models.CharField(max_length=500, null=True, blank=True)
    post = models.ForeignKey(Capture, on_delete=models.CASCADE, related_name='vote')


    def __str__(self):
        return self.user_ip
    
    def add_new_vote(self, request, daily_id):
        """ Creates a vote on specific capture and saves it into the database. """

        if 'uuid' not in request.session:
            request.session['uuid'] = str(uuid.uuid4())

        return_ip = return_user_ip(request)
        capture = Capture.objects.get(pk=daily_id)

        existing_vote = upvotes.objects.filter(UUID=request.session['uuid'], post=capture).first()

        if existing_vote:
            # User has already voted, remove their vote
            capture.upvotes = capture.upvotes - 1
            existing_vote.delete()

        else:
            # User hasn't voted yet, add their vote
            capture.upvotes = capture.upvotes + 1
            self.UUID = request.session['uuid']
            self.user_ip = return_ip
            self.post = capture
            self.save()

        capture.save()

        return capture.upvotes




class comments(models.Model):

    UUID = models.UUIDField(default=uuid.uuid4, editable=False)
    user_ip = models.CharField(max_length=500, null=True, blank=True)
    post = models.ForeignKey(Capture, on_delete=models.CASCADE, related_name='capture')
    comment = models.CharField(max_length=100, null=True, blank=True)
    date_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.comment
    

    def create_comment(self, request, daily_id, comment):
        """ Creates a comment on a post. """

        if 'uuid' not in request.session:
            request.session['uuid'] = str(uuid.uuid4())

        return_ip = return_user_ip(request)

        capture = Capture.objects.get(pk=daily_id)
        capture.comments_count = capture.comments_count + 1
        capture.save()

        self.UUID = request.session['uuid']
        self.user_ip = str(return_ip)
        self.post = capture
        self.comment = f"{str(comment)}"
        self.date_time = datetime.now()
        self.save()


    def remove_comment(self, request, pk_number):
        """ Removes user comment. """
        
        selected_comment = comments.objects.get(pk=pk_number)
        captures = Capture.objects.filter(capture_name=selected_comment.post.capture_name, 
                                          version=selected_comment.post.version)

        for cap in captures:

            if request.session['uuid']  == str(selected_comment.UUID):
                cap.comments_count = cap.comments_count - 1
                cap.save()
                selected_comment.delete()
            else:
                print("Not matching")




def return_user_ip(request):
    """ Returns a users IP address. """

    userIP = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '')).split(',')[0].strip()
    return userIP