import os
import shutil

from django.conf import settings


def reduce_gif_sizes():
    """ Compares wagtails /media/original_images .gif files with the /media/images .gif files,
        If rendition gifs are larger in size, then remove it and replace it with original smaller file.
        The problem i had, was i would upload small .gifs of say 200kb, wagtail - wand would convert 3 different versions
        of the .gif file which was sometimes over 5mb. So this function just degreases the size, for example one blog
        page full of .gifs could be 45mb, and after running this function it was down to 3.5mb.
    """
    GFGF_ACTIVE = True
    MEDIA_PATH = settings.MEDIA_ROOT
    REMOVE_ORIGINAL_GIF = settings.GFGF_REMOVE_ORIGINAL_GIF
    REMOVE_THUMBNAIL_GIF = settings.GFGF_REMOVE_THUMBNAIL_GIF
    REMOVE_MAX_WIDTH_GIF = settings.GFGF_REMOVE_MAX_WIDTH_GIF
    REPLACE_RENDITION_GIF = settings.GFGF_REPLACE_RENDITION_GIF

    if GFGF_ACTIVE:

        images = f"{MEDIA_PATH}/images"
        original_images = f"{MEDIA_PATH}/original_images"
        list_original_files = os.listdir(original_images)
        list_imgages_files = os.listdir(images)

        original_gif_list, images_gif_list = get_gifs(list_original_files, list_imgages_files)

        for i in original_gif_list:
            name = i.split(".")[0]
            original_full_path = f"{original_images}/{i}"

            for e in images_gif_list:
                rendition_name = (e.split(".")[0])
                rendition_res = (e.split(".")[1])

                if name == rendition_name:
                    rendition_full_path = f"{images}/{e}"

                    if rendition_res == "max-800x600":
                        if REMOVE_MAX_WIDTH_GIF:
                            os.remove(rendition_full_path) # Remove if unwanted.

                    elif rendition_res == "max-165x165":
                        if REMOVE_THUMBNAIL_GIF:
                            os.remove(rendition_full_path) # Remove if unwanted.

                    else:
                        original_size = os.stat(original_full_path).st_size
                        rendition_size = os.stat(rendition_full_path).st_size

                        if REPLACE_RENDITION_GIF:
                            # If the rendition file is greater than original, then replace it will original, which is smaller.
                            if int(rendition_size) > int(original_size):

                                print(f"{e} - {rendition_size} bytes - is greater than {i} - {original_size} bytes -")
                                shutil.copy(original_full_path, rendition_full_path)

                            else:
                                print("nothing to replace.")

    else:
        pass


def get_gifs(list_original_files, list_imgages_files):
        """ Returns all gifs from both directories. """

        original_gif_list = []
        images_gif_list = []
        
        for f in list_original_files:

            if f.endswith(".gif"):
                original_gif_list.append(f"{f}")
        
        for ff in list_imgages_files:

            if ff.endswith(".gif"):
                images_gif_list.append(f"{ff}")

        return original_gif_list, images_gif_list
