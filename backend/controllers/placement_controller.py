from flask import Blueprint, request, Response
import time
from utils.db import messages_collection
from services.qa_service import process_question
from services.fallback_service import needs_fallback, generate_fallback_response

placement_bp = Blueprint('placement', __name__)

@placement_bp.route('/placement', methods=['POST'])
def placement():
    user_question = request.json.get('message')
    email = request.json.get('email')

    response_text = process_question(user_question, "CC_Dataset.pdf")
    if needs_fallback(response_text):
        response_text = generate_fallback_response(user_question)

    messages_collection.insert_one({
        "user_message": user_question,
        "bot_response": response_text,
        "user_email": email,
        "timestamp": time.time()
    })

    return Response(stream_text(response_text), status=200, mimetype='text/plain')

def stream_text(text):
    for char in text:
        yield char
        time.sleep(0.03)
