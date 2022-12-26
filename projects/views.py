from django.shortcuts import render
from projects.models import Project

def project_index(request):
    project = Project.objects.all()

    context = {'projects': project}
    return render(request, template_name='project_index.html', context=context)


def project_detail(request, pk):
    project = Project.objects.get(pk=pk)

    context = {'projects': project}
    return render(request, template_name='project_detail.html', context=context)


