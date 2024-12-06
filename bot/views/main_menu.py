from ampalibe import Payload
from ampalibe.ui import QuickReply


def main_menu_view(sender_id, chat):
    quick_rep = [
        QuickReply(
            title="Récupérer une video",
            payload=Payload("/get-video"),
            image_url="https://cdn-icons-png.flaticon.com/512/4237/4237920.png"
        ),
        
    ]

    # next=True in parameter for displaying directly next list quick_reply
    chat.send_quick_reply(sender_id, quick_rep, 'Que voulez-vous faire ?')