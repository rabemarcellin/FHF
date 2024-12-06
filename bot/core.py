import ampalibe
from ampalibe import Messenger, Model
from ampalibe.messenger import Filetype

from views.main_menu import main_menu_view
from views.input_token_form import token_form_view
from views.video_list import video_list_view
from service.upload import get_video_part
chat = Messenger()
query = Model()
# create a get started option to get permission of user.
# chat.get_started()

@ampalibe.command('/')
def main(sender_id, cmd, **ext):
    '''
    main function where messages received on
    the facebook page come in.

    @param sender_id String: 
        sender facebook id
    @param cmd String: 
        message content
    @param ext Dict: 
        contain list of others
            data sent by facebook (sending time, ...)
            data sent by your payload if not set in parameter
    '''
    if(cmd == "Upload FHF"):
        main_menu_view(sender_id, chat)
    else:
        print("here")

@ampalibe.command('/get-video')
def video_token(sender_id, cmd, **ext):
    token_form_view(sender_id, chat, query)


@ampalibe.action('/video-token')
def input_token_form(sender_id, cmd, **ext):
    query.set_action(sender_id, None)  #  clear current action
    token = cmd
    video_list_view(sender_id, token, chat)