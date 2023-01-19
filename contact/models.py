from django.db import models

# Create your models here.



class ignore_list(models.Model):
    email = models.TextField()

    def __str__(self):
        return f"{self.email}"



class Email_list(models.Model):
    email = models.TextField(default=None, blank=True)
    name = models.TextField(default=None, blank=True)
    message = models.TextField(default=None, blank=True)
    subject = models.TextField(default=None, blank=True)
    time = models.TimeField(auto_now=True)





if __name__ == "__main__":

    print(models)