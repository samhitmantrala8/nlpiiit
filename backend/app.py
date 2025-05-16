from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
import os

from controllers import auth_controller, chat_controller, generalinfo_controller, placement_controller, subject_controllers

app = Flask(__name__)
bcrypt = Bcrypt(app)
load_dotenv()
app.secret_key = '1a2b3c4d5e6f'
CORS(app, supports_credentials=True)

# Register Blueprints
app.register_blueprint(auth_controller.auth_bp)
app.register_blueprint(chat_controller.chat_bp)
app.register_blueprint(generalinfo_controller.geninfo_bp)
app.register_blueprint(placement_controller.placement_bp)
app.register_blueprint(subject_controllers.subject_bp)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Get port from env or default to 10000
    app.run(host="0.0.0.0", port=port)
