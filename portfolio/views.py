from django.shortcuts import render
from portfolio.models import Portfolio

def portfolio_index(request):
    portfolio = Portfolio.objects.all()

    context = {'portfolio': portfolio}
    return render(request, template_name='portfolio_index.html', context=context)


def portfolio_detail(request, pk):
    portfolio = Portfolio.objects.get(pk=pk)

    context = {'portfolio': portfolio}
    return render(request, template_name='portfolio_detail.html', context=context)


