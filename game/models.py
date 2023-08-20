import uuid
from django.db import models

from datetime import datetime, timedelta

from game import game_utils


# Create your models here.
class LeaderBoard(models.Model):

    username = models.CharField(max_length=100, null=True, blank=True)
    country_full = models.CharField(max_length=100, null=True, blank=True)
    country_short = models.CharField(max_length=10, null=True, blank=True)
    UUID = models.UUIDField(default=uuid.uuid4, editable=False)
    comments: models.CharField(max_length=250, null=True, blank=True)
    user_ip = models.CharField(max_length=500, null=True, blank=True)
    points = models.IntegerField(default=0)
    zombie_deaths = models.IntegerField(default=0)
    time_elapsed = models.CharField(max_length=100, null=True, blank=True)
    date_time = models.DateTimeField(null=True, blank=True)
    order = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        ordering = ['order']


    def __str__(self):
        return f"{self.points}_{self.username}"
    

    def save_to_leaderBoard(self, request, subbmitted_data, forms):
        """ Save to the leaderBoard. """

        is_naughty, censored_text = game_utils.check_naughty_words(subbmitted_data["username"])

        # Check UUID already exists, then check is new score is greater than the last.
        leader_board_objects = LeaderBoard.objects.filter(UUID=request.session['uuid'])
        new_points = subbmitted_data["form_points"]
        is_personal_best = True
        email_isBot = subbmitted_data["email"] # email field is not displayed, Used as honeypot for bots.

        for i in leader_board_objects:

            if int(new_points) >= int(i.points):
                i.delete()
            else:
                is_personal_best = False

        if is_personal_best:
            if is_naughty != True:
                if email_isBot != None:

                    self.username = subbmitted_data["username"]
                    self.comment = subbmitted_data["comment"]
                    self.country_full = forms.save_leaderBoard.COUNTRIES_DICT.get(subbmitted_data["country"], 'Unknown')
                    self.country_short = str(subbmitted_data["country"]).lower()
                    self.UUID = request.session['uuid']
                    self.points = new_points
                    self.zombie_deaths = subbmitted_data["form_zombie_deaths"]
                    self.user_ip = game_utils.return_user_ip(request)
                    self.comments = subbmitted_data["comment"]
                    self.time_elapsed = subbmitted_data["form_time_elapsed"]
                    self.date_time = datetime.now()
                    self.order = int(subbmitted_data["form_points"])

                    self.save()


        return is_personal_best, is_naughty, censored_text



