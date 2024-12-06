import ampalibe


def token_form_view(sender_id, chat, query):
    chat.send_text(sender_id, "Veuillez entrer la clé de votre video:")
    query.set_action(sender_id, "/video-token")