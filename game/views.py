import uuid
from django.shortcuts import render
from django.shortcuts import redirect
from .models import LeaderBoard
from game import forms

from game import game_utils

# Create your views here.
def zombie_land(request):

    if request.method == "GET":

        save_score_form = forms.save_leaderBoard()
    
        # on page load, collect leaderboard data and ranking. 
        # get client cookie if exists and see where they rank on the leaderboard.
        leaderBoard = LeaderBoard.objects.all()
        leaderBoard_order = leaderBoard.order_by('order').reverse

        if 'uuid' not in request.session:
            print("NO UUID, creating it.")
            request.session['uuid'] = str(uuid.uuid4())

        leaderboard_ranks = []  
        for i in leaderBoard:
            leaderboard_ranks.append(i.points)

        first_visit = 'visited_before' not in request.session
        print(first_visit)
            

        context = {
            "leaderBoard_data": leaderBoard_order,
            "save_score_form": save_score_form,
            "leaderboard_ranks": leaderboard_ranks,
            "show_leaderboard": False,
            "UUID": request.session['uuid'],
            "is_personal_best": True,
            "is_naughty": False,
            "censored_text": None,
        }


        return render(request, "zombieland.html", context)
    
    elif request.method == "POST":

        form = forms.save_leaderBoard(request.POST)

        if form.is_valid():

            save_score_form = forms.save_leaderBoard()
            subbmitted_data = form.cleaned_data

            if 'uuid' not in request.session:
                print("NO UUID, creating it.")
                request.session['uuid'] = str(uuid.uuid4())

            # Save rank.
            LeaderBoard_obj = LeaderBoard()
            is_personal_best, is_naughty, censored_text = LeaderBoard_obj.save_to_leaderBoard(request, subbmitted_data, forms)

            # return all ranks
            leaderBoard = LeaderBoard.objects.all()
            leaderBoard_order = leaderBoard.order_by('order').reverse

            leaderboard_ranks = []  
            for i in leaderBoard:
                leaderboard_ranks.append(i.points)


            context = {
                "leaderBoard_data": leaderBoard_order,
                "save_score_form": save_score_form,
                "leaderboard_ranks": leaderboard_ranks,
                "show_leaderboard": True,
                "UUID": request.session['uuid'],
                "is_personal_best": is_personal_best,
                "is_naughty": is_naughty,
                "censored_text": censored_text,
            }

        return render(request, "zombieland.html", context)
    


    
