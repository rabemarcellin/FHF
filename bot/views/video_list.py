from ampalibe.messenger import Filetype
from service.upload import get_video_part

def video_list_view(sender_id, token, chat):
    try:
        response = get_video_part(token)
        videos = response["data"]
        for video in videos:
            video_url = video["url"]
            chat.send_file_url(sender_id, video_url, Filetype.video)
        chat.send_text(sender_id, "De rien!")
    except:
        chat.send_text(sender_id, "Ouups! Une erreur s'est produite")
        chat.send_text(sender_id, "Vérifier bien à ce que la clé soit correct")