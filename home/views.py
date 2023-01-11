from django.shortcuts import render

def home_page(request):
    " Render / Logic for the home page. " 

    context = {}
    return render(request, template_name="home_page.html", context=context)



def temp_page(request):
    " A temp under construction page. " 

    context = {}
    return render(request, template_name="temp.html", context=context)
