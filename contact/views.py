from django.shortcuts import render, get_list_or_404
from django.http import HttpResponseRedirect
from django.core.mail import send_mail, get_connection

from contact import forms


# Create your views here.
def contact_page(request):
    " Render / Logic for the contact page. " 

    submitted = False

    if request.method == "POST":
        form = forms.ContactForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            # assert False

            con = get_connection('django.core.mail.backends.console.EmailBackend')
            send_mail(
                    cd['subject'],
                    cd['message'],
                    cd.get('email', 'noreply@example.com'), ['siteowner@example.com'], connection=con)

            return HttpResponseRedirect('/contact?submitted=True')

    else:
        form = forms.ContactForm()
        if 'submitted' in request.GET:
            submitted = True

    context = {'form' : form, 'submitted' : submitted}
    return render(request, template_name="contact_page.html", context=context)




