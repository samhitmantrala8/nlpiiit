from flask import Flask, request, Response, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from pymongo import MongoClient
from transformers import AutoTokenizer, AutoModelForCausalLM
import time
import json
import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import google.generativeai as genai  # Ensure this import is present
import os

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}}, supports_credentials=True)

# Replace with your MongoDB URI and database setup
MONGO_URI = 'mongodb+srv://samhitmantrala8:PrProject@cluster0.k63kxvp.mongodb.net/prproject?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(MONGO_URI)
db = client['mydatabase']
users_collection = db['users']
messages_collection = db['messages']  # Ensure this is defined

# Ensure app.secret_key is set for session management
app.secret_key = '1a2b3c4d5e6f'  

# Load the Google API key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

# Predefined list of words to check in the response
predefined_words = [
    "sorry", "don't", "have", "information", "related", "query",
    "context", "does", "not", "mention", "anything",
    "I", "cannot", "answer", "question",
    "provided"
]

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_path = os.path.join("pdfs", pdf)  # Update path to include 'pdfs' folder
        pdf_document = fitz.open(pdf_path)
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text += page.get_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = HuggingFaceEmbeddings(model="google-bert/bert-base-cased")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context then give some answer based on your facebook/opt-350m chatbot.\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """
    model = ChatGoogleGenerativeAI(model="facebook/opt-350m-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

def user_input(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    # Load FAISS index with dangerous deserialization enabled
    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)

    chain = get_conversational_chain()
    
    response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)

    return response["output_text"]

def process_user_question(user_question, pdf_filename):
    # Extract text from the specified PDF file
    pdf_text = get_pdf_text([pdf_filename])
    text_chunks = get_text_chunks(pdf_text)
    get_vector_store(text_chunks)
    
    response_text = user_input(user_question)
    return response_text

def needs_fallback(response_text):
    response_words = response_text.lower().split()
    if len(response_words) > 30:
        return False
    match_count = sum(1 for word in predefined_words if word in response_words)
    return match_count >= 3

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return Response(json.dumps({"error": "All fields are required"}), status=400, mimetype='application/json')

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return Response(json.dumps({"error": "User already exists"}), status=400, mimetype='application/json')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_data = {"username": username, "email": email, "password": hashed_password}
    users_collection.insert_one(user_data)
    
    return Response(json.dumps({"message": "User registered successfully"}), status=201, mimetype='application/json')


@app.route('/cul_resp', methods=['POST'])
def cul_resp():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "culturalclubs.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')

@app.route('/tech_resp', methods=['POST'])
def tech_resp():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "technicalclubs.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')
@app.route('/cn_acad', methods=['POST'])
def cn_resp():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "cnPR.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')


@app.route('/dbms_acad', methods=['POST'])
def dbms_resp():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "dbmsPR.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')


@app.route('/oops_acad', methods=['POST'])
def oops_resp():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "oopsPR.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')


@app.route('/os_acad', methods=['POST'])
def os_resp():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "osPR.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')

      
@app.route('/api/user/chat-history', methods=['GET'])
def get_chat_history():
    email = session.get('email')
    if not email:
        print("No email found in session")  # Debugging
        return Response("User not logged in", status=401, mimetype='text/plain')
    
    try:
        chat_history = messages_collection.find({"user_email": email})
        chat_history_list = list(chat_history)
        
        for message in chat_history_list:
            message['_id'] = str(message['_id'])
        
        return Response(json.dumps(chat_history_list), status=200, mimetype='application/json')
    except Exception as e:
        print(f"Error in get_chat_history: {str(e)}")  # Log error for debugging
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')

@app.route('/api/auth/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return Response(json.dumps({"error": "Email and password are required"}), status=400, mimetype='application/json')

    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return Response(json.dumps({"error": "Invalid email or password"}), status=401, mimetype='application/json')

    session['email'] = email 
    response_data = {
        "message": "Signed in successfully",
        "user": {
            "username": user['username'],
            "email": user['email']
        }
    }
    return Response(json.dumps(response_data), status=200, mimetype='application/json')

@app.route('/api/auth/signout', methods=['POST'])
def sign_out():
    try:
        session.pop('email', None)  # Clear the session data
        return Response("Successfully signed out", status=200)
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500)

@app.route('/geninfo', methods=['POST'])
def geninfo():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "geninfo.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')

@app.route('/placement', methods=['POST'])
def placement():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "placementsPR.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')

@app.route('/placementG', methods=['POST'])
def placementG():
    user_question = request.json.get('message')
    email = request.json.get('email')  # Ensure email is fetched from session

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        # Tokenize the user question
        inputs = tokenizer(user_question, return_tensors="pt")

        with torch.no_grad():  # Disable gradient calculation for inference
            outputs = model.generate(
                **inputs,
                max_length=100,  # Adjust the maximum length as needed
                num_beams=5,     # Use beam search for better quality
                no_repeat_ngram_size=2,  # Avoid repeating n-grams
                early_stopping=True  # Stop when all beams reach the end token
            )

        # Decode the response
        response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Clean the response text
        response_text = response_text.replace('<Human>', '').replace('<AI>', '').strip()

        if needs_fallback(response_text):
            # Fallback to Google Generative AI if needed
            google_model = get_google_model()  # Replace with the appropriate function
            response_text = google_model(user_question)  # Update this to use the right method

        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)

        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')

@app.route('/sports_resp', methods=['POST'])
def sports_resp():
    user_question = request.json.get('message')
    email = request.json.get('email')  

    if not user_question:
        return Response("Question is required", status=400, mimetype='text/plain')

    try:
        response_text = process_user_question(user_question, "sportsclubs.pdf")
        if needs_fallback(response_text):
            model = genai.GenerativeModel('facebook/opt-350m-pro')
            response = model.generate_content(user_question)
            response_text = response.text
        
        # Save both user question and bot response to MongoDB
        messages_collection.insert_one({
            "user_message": user_question,
            "bot_response": response_text,
            "user_email": email,
            "timestamp": time.time()
        })

        def stream(response_text):
            for char in response_text:
                yield char
                time.sleep(0.03)
        return Response(stream(response_text), status=200, mimetype='text/plain')
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, mimetype='text/plain')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
