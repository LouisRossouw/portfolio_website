import contact.functions as func

from django.shortcuts import render, get_list_or_404
from django.http import HttpResponseRedirect
from django.http import Http404
from django.core.mail import send_mail, get_connection
from django.shortcuts import redirect

from contact import forms


# Create your views here.
def contact_page(request):
    " Render / Logic for the contact page. " 

    submitted = False

    if request.method == "POST":
        form = forms.ContactForm(request.POST)
        
        if form.is_valid():
            contact_form = form.cleaned_data
            # assert False

            reformatted_message = f"email from louisrossouw.com website: \n\nName: {contact_form['yourname']}\n\nMessage:\n\n{contact_form['message']}\n\nTheir Mail: {contact_form['email']}"

            # Check if user email is part of the ignore list, return True or False.
            ignore_mail = func.ignore_email_list(contact_form['email'])

            if ignore_mail != True:

                # Send email via smtp to my main email.
                send_mail(
                        contact_form['subject'],
                        reformatted_message,
                        contact_form['email'], ['louis@louisrossouw.com'])

                # Save email to the contact_email_list database.
                func.save_email_list(contact_form)

                return HttpResponseRedirect('/contact?submitted=True')

            else:
                # If part of the ignore list - then redirect to a random web page of a corn dog.
                return redirect("http://corndog.io/")

    else:
        form = forms.ContactForm()
        if 'submitted' in request.GET:
            submitted = True

    context = {'form' : form, 'submitted' : submitted}
    return render(request, template_name="contact_page.html", context=context)


