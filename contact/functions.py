import os

from contact.models import ignore_list, Email_list



def save_email_list(contact_form):
    """ Saves users email to the databse. """

    email_exists = Email_list.objects.filter(email=contact_form["postbox"]).exists()

    # If email already exists in the database, then dont save it to the database.
    if email_exists != True:

        add_email = Email_list()
        add_email.email = contact_form["postbox"]
        add_email.name = contact_form["yourname"]
        add_email.message = contact_form["message"]
        add_email.subject = contact_form["subject"]

        add_email.save()

    else:
        pass




def ignore_email_list(email):
    """ This function loops through a list, 
        if an email exists on the ignore list, then ignire it! """

    ignore_lists = return_ignore_emails()

    if email in ignore_lists:
        print("Email is part of the ignore group")
        return True
    else:
        return False




def return_ignore_emails():
    """ Returns a list from the database, of all the emails to ignore """

    get_email_list = ignore_list.objects.all()
    returned_ignored_emails = []


    for mail in get_email_list:
        returned_ignored_emails.append(mail.email)

    return returned_ignored_emails






if __name__ == "__main__":

    email = "annoyingbob@gmail.com"
    ignore_mail = ignore_email_list(email)


