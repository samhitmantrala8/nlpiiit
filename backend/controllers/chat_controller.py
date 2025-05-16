from flask import Blueprint, session, Response
import json
from utils.db import messages_collection

chat_bp = Blueprint('chat', __name__, url_prefix='/api/user')

@chat_bp.route('/chat-history', methods=['GET'])
def get_chat_history():
    email = session.get('email')
    if not email:
        return Response("User not logged in", status=401)

    history = list(messages_collection.find({"user_email": email}))
    for h in history:
        h['_id'] = str(h['_id'])

    return Response(json.dumps(history), status=200, mimetype='application/json')
