from game import countries_list 
from better_profanity import profanity


profanity.load_censor_words()



def calculate_user_rank(LeaderBoard, user_points):
    """ Add user points to ranks list to calculate their rank in the leaderboard. """

    ranks = []

    for i in LeaderBoard.objects.all():
        ranks.append(i.points)

    ranks.append(user_points)
    ranks.sort()
    ranks.reverse()

    return ranks.index(user_points) + 1




def return_user_ip(request):
    """ Returns a users IP address. """

    userIP = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '')).split(',')[0].strip()
    return userIP




def check_naughty_words(word):
    """ Uses better_profanity lib to check for naughty words. """

    censored_text = profanity.censor(word)
    is_naughty = profanity.contains_profanity(word)

    return is_naughty, censored_text




def get_country_list():
    """ Formats a list of countries and their code into a list of tuples """

    all_countries = []

    for i in countries_list.countries:

        country_code = i["code"]
        country_name = i["name"]

        all_countries.append((country_code, country_name))

    return all_countries