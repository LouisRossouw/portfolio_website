from django.shortcuts import render

# Create your views here.

def dev_test(request):


    return render(request, "test.html", {})
