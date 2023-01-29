""" I had some trouble trying to update my website source code on the server with github WHILE keeping
    some local files / content / DB etc files, so the point of this script is to keep specific local files, 
    and then download the latest source code from github, and move the local files back into the source code.
"""

import os
import json
import time
import shutil
import logging
import random
from git import Repo, rmtree

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', )


# These file are kept between updates.
# They get removed from the main repo, and re-added after git clone.
# use a relative path to the specific file or directory.
KEEP_FILES = [
    ".env",
    "db.sqlite3",
    "media",
    "venv",

    "home/static/images",

    "mysite/settings.py",
    "mysite/static/font-awesome",
    "mysite/static/images",
]

VERSIONS = False # Currently no function for this.
BACKUP_FILES = [
    ".env",
    "db.sqlite3",
    "mysite/settings.py",
]

BRANCH = "master"
GITHUB_REPO = "https://github.com/LouisRossouw/portfolio_website.git"

TOOLNAME = "web_update"
LOCAL_REPO = "D:/work/projects/dev/projects/portfolio_website_test"
BACKUP_DIR = "D:/work/projects/dev/projects/"
UPDATER_DIR = os.path.join(BACKUP_DIR, TOOLNAME)



def perform_backup():
    """ Performs a simple backup for the backup_files list. """

    logging.info("Backup True.")

    for f in BACKUP_FILES:
        src = f"{LOCAL_REPO}/{f}"
        dst = f"{UPDATER_DIR}/backup"

        dir_exists = check_dirs(dst)
        logging.info(f"Backing up: -- {f}")

        if dir_exists:
            try:
                shutil.copy(src, dst)
            except FileNotFoundError:
                logging.warning(f" ** {f} - File does not exist.")




def write_to_json(json_path, data):
    """ Create and write to json file. """

    logging.info("Writing json data.")
    with open(json_path, 'w') as f:
        json.dump(data, f, indent=6)




def read_json(json_path):
    """ Reads json file """

    logging.info("Reading json data.")
    with open(json_path) as f:
        json_file = json.loads(f.read())

    return (json_file)




def check_dirs(destination_path):
    """ Makes destination dir if does not exist. """

    logging.info("Checking if tmp directory exists.")
    if os.path.exists(destination_path) != True:

        logging.info("Tmp does not exist - making directory.")
        os.mkdir(destination_path)

    return True




def is_dir(file_path):
    """ Checks if the source file is a directory. """
    return os.path.isdir(file_path)




def execute_shutil(source_path, 
                   destination_path, 
                   is_directory, file, generate_id):
    """ copies out files """

    f_name = os.path.basename(source_path)
    ID_DIR = f"{destination_path}/{generate_id}"

    if os.path.exists(source_path):

        if is_directory:
            if os.path.exists(ID_DIR) == False:
                os.mkdir(ID_DIR)

            logging.info(f"Copying: {f_name} directory, to /" + TOOLNAME)
            shutil.move(src=str(source_path), 
                            dst=str(f"{destination_path}/{generate_id}/{f_name}"))

        else:
            if os.path.exists(ID_DIR) == False:
                os.mkdir(ID_DIR)

            logging.info(f"Copying: {file} file, to /" + TOOLNAME)
            shutil.move(src=str(source_path), 
                        dst=str(f"{destination_path}/{generate_id}/{f_name}"))
    
    else:
        logging.warning(f"{file} - does not exist. skipping.")




def record_data(data, file_source, 
                file_destination, is_directory, generate_id,):
    """ Records the copied files path into a .json file, 
        so it can easily move it back to where they came from. """

    file_name = os.path.basename(file_source)

    data[str(generate_id) + "|" + file_name] = {
        "file_name": os.path.basename(file_source),
        "file_source": file_source,
        "file_destination": file_destination,
        "is_dir": is_directory,
        "ID": generate_id, 
        }

    return data




def perform_update_copy():
    """ copies files to external directory and writes out a json
        file of the data so that we can do the reverse option. """

    data = {}

    if check_dirs(UPDATER_DIR) == True:

        for file in KEEP_FILES:

            file_source = f"{LOCAL_REPO}\{file}"
            file_destination = f"{UPDATER_DIR}"
            is_directory = is_dir(file_source)

            generate_id = random.randint(1000, 10000)

            data = record_data(data, file_source, 
                                file_destination, is_directory, generate_id)

            execute_shutil(
                            file_source, 
                            file_destination, 
                            is_directory,
                            file, 
                            generate_id
                            )

        write_to_json(f"{file_destination}/data.json", data)




def clear_directory():
    """ clears out the websites directory before doing a git pull. """

    logging.info("Clearing out Directory.")
    for f in os.listdir(LOCAL_REPO):

        file_path = f"{LOCAL_REPO}/{f}"
        logging.info(f"Removing: {f} - from: {os.path.basename(LOCAL_REPO)}")

        try:
            if is_dir(file_path):
                rmtree(f"{LOCAL_REPO}/{f}")

            else:
                os.remove(f"{LOCAL_REPO}/{f}")
                
        except PermissionError:
            logging.warning(f"Failed to remove: {f}")




def clone_git():
    """ Creates a nice fresh clone from GitHub repository. """

    Repo.clone_from(GITHUB_REPO,
                        LOCAL_REPO,
                        branch=BRANCH)




def move_files_back():
    """ Copies files back into repository. """

    data = read_json(f"{UPDATER_DIR}/data.json")

    for d in data:

        file_destination = data[d]["file_destination"]
        file_source = data[d]["file_source"]

        ID = data[d]["ID"]
        file_name = data[d]["file_name"]

        src = f"{file_destination}/{str(ID)}/{file_name}"
        dst = f"{os.path.dirname(file_source)}/{file_name}"

        # The os.shutil func cant replace directories, instead it places the moved dir
        # into the directory it was supposed to overwrite, so this func removes the dir first.
        if is_dir(dst):
            logging.info(f" ** {dst} is a directory - Removing first and then replacing.")
            rmtree(dst)
            time.sleep(1)

        logging.info(f" -- moving: {d} - to: {dst}")

        try:
            shutil.move(src=src, dst=dst)
        except FileNotFoundError:
            logging.warning(f"{d} - does not exist. skipping.")




def final_cleanup():
    """ Remove ID dirs left over after the update. """

    data = read_json(f"{UPDATER_DIR}/data.json")

    for d in data:
        ID = str((data[d]["ID"]))

        try:
            rmtree(os.path.join(UPDATER_DIR, ID))
        except FileNotFoundError:
            logging.warning(f" ** {d} -- file not found, ignoring removal.")




def run_update():
    """ Runs the update procedure. """

    update = input("Run update - [ y / n ]?")

    line_length = 100

    if update.lower() == "y":

        to_backup = input("Backup - [ y / n ]?")

        logging.info("Starting Update")
        logging.info(("-")*line_length)

        if to_backup.lower() == "y":
            perform_backup()

        logging.info("Copying important local files to /" + TOOLNAME)

        perform_update_copy()

        logging.info(("-")*line_length)
        logging.info("Copying complete.")

        time.sleep(2)
        logging.info(("-")*line_length)

        clear_directory()

        logging.info(("-")*line_length)
        logging.info("Clearing complete.")

        time.sleep(2)
        logging.info(("-")*line_length)
        logging.info(f"Creating a fresh clone from  {GITHUB_REPO} -- {BRANCH}")

        clone_git()

        for f in os.listdir(LOCAL_REPO):
            logging.info(f" -- {f}")

        logging.info(("-")*100)
        logging.info("Clone complete.")

        time.sleep(2)

        move_files_back()

        final_cleanup()

        logging.info("Cleaning.")

        logging.info(("-")*line_length)
        logging.info("Update complete.")

        input()
    
    else:
        exit()







if __name__ == "__main__":

    try:
        run_update()
    except Exception as e:
        logging.error(e)
        input()

    


