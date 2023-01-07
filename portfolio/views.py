import os

from django.conf import settings
from django.shortcuts import render
from portfolio.models import Portfolio
from django.templatetags.static import static

def portfolio_index(request):
    portfolio = Portfolio.objects.all()

    context = {'portfolio': portfolio}
    return render(request, template_name='portfolio_index.html', context=context)


def portfolio_detail(request, pk):
    portfolio = Portfolio.objects.get(pk=pk)

    additional_images = return_additional_images(portfolio)


    context = {'portfolio': portfolio, 'additional_images' : additional_images[0], "column_width" : additional_images[1]}
    return render(request, template_name='portfolio_detail.html', context=context)




def calculate_columns(dict):
    """ Returns width based on how much content is available. """

    count = []

    for k, i in dict.items():
        if i != False:
            count.append(i)

    count_length = len(count)

    if count_length == 0 or count_length == 1:
        column_1 = "portfolio_detail_TEXT_DYNAMIC_LENGTH_1"
        column_2 = "portfolio_detail_MYSHOTS_DYNAMIC_LENGTH_1"
        column_3 = "portfolio_detail_RAW_DYNAMIC_LENGTH_1"
        column_4 = "portfolio_detail_BREAKDOWN_DYNAMIC_LENGTH_1"

    if count_length == 2:
        column_1 = "portfolio_detail_TEXT_DYNAMIC_LENGTH_2"
        column_2 = "portfolio_detail_MYSHOTS_DYNAMIC_LENGTH_2"
        column_3 = "portfolio_detail_RAW_DYNAMIC_LENGTH_2"
        column_4 = "portfolio_detail_BREAKDOWN_DYNAMIC_LENGTH_2"
        
    if count_length == 3:
        column_1 = "portfolio_detail_TEXT_DYNAMIC_LENGTH_3"
        column_2 = "portfolio_detail_MYSHOTS_DYNAMIC_LENGTH_3"
        column_3 = "portfolio_detail_RAW_DYNAMIC_LENGTH_3"
        column_4 = "portfolio_detail_BREAKDOWN_DYNAMIC_LENGTH_3"

    return {"column_1" : column_1, "column_2" : column_2, "column_3" : column_3, "column_4" : column_4}




def return_additional_images(portfolio):
    """ Returns additional images for the specific project if it exists. """

    dict = {}

    images_path = portfolio.project_acronym
    static_path = f"portfolio/img/additional_images/{images_path}"
    addition_images_path = f"{settings.BASE_DIR}/portfolio/static/{static_path}/" # locally source the image.

    if os.path.exists(addition_images_path) == True:

        for dir in ['raw', 'myshots', 'breakdown']:

            return_contents = os.listdir(f"{addition_images_path}/{dir}")

            if bool(return_contents) == True:
                collected_list = []
                for img in return_contents:
                    collected_list.append(f"{static_path}/{dir}/{img}")

                dict[dir] = collected_list

            else:
                dict[dir] = False

    columns = calculate_columns(dict)

    return dict, columns








if __name__ == "__main__":

    dict = {"test1" : False, "test2" : False, "test3" : False}
    calculate_columns(dict)
    