from portfolio import functions

from django.shortcuts import render
from .models import Projects




def portfolio_index(request):
    """ Renders all portoflio images. """

    portfolio = Projects.objects.order_by('project_date')

    context = {'portfolio': portfolio}

    return render(request, template_name='portfolio_index.html', context=context)




def portfolio_detail(request, pk):
    """ Renders all data from specific chosen project + additional images / videos if
        they exist in the server directories. """

    portfolio = Projects.objects.get(pk=pk)

    # Returns additional images if they exist on the server, can calculates how many columns to generate.
    additional_images = functions.return_additional_images(portfolio)


    context = {'portfolio': portfolio,
                'additional_images' : additional_images[0],
                "column_width" : additional_images[1]}


    return render(request, template_name='portfolio_detail.html', context=context)










