from django.test import TestCase

from contact.models import ignore_list, Email_list


# Create your tests here.
def return_ignore_emails():
    """ Returns a list from the database, of all the emails to ignore """

    get_email_list = ignore_list.objects.all()
    returned_ignored_emails = []


    for mail in get_email_list:
        returned_ignored_emails.append(mail.email)

    return returned_ignored_emails




def save_email_list(data):
    """ Saves users email to the databse. """

    add_email = Email_list()
    add_email.email = "lourou99@gmail.com"
    add_email.name = "Louis"
    add_email.message = "hi"
    add_email.subject = "Louis"

    add_email.save()

    print(add_email)



def return_email_list():
    
    print(Email_list.objects.filter(email='lourou99@gmail.com').exists())





return_email_list()