
# IIIT Jabalpur Chatbot

## Aim
The aim of this project was to create a comprehensive chatbot for IIIT Jabalpur. The chatbot is designed to provide detailed information to prospective students on various topics such as placement statistics, sports facilities, cultural clubs, campus life, and coding culture.

## Project Description
This project involved fine-tuning a pre-trained model from Hugging Face on over 750+ unique question-answer pairs using Parameter Efficient Fine-Tuning (PEFT). Due to computational limitations, the project later transitioned to using Retrieval Augmented Generation (RAG) to effectively handle changes in the data. The chatbot can dynamically retrieve and generate responses based on the most current information available.

## Tech Stack
Frontend: ReactJS, Tailwind CSS
Backend: Flask, MongoDB
## Modelling: 
Hugging Face Transformers, RAG, PEFT, Tried sentence-transformers, BERT embeddings, Google GenAI embeddings

Efficiency: The chatbot has automated the response process, saving over 100 hours of administrative time by answering frequently asked questions.
### Scalability: 
It is capable of handling over 1000 queries each day, providing reliable and accurate information to prospective students.
Impact: This tool greatly enhances the engagement and information dissemination for IIIT Jabalpur, making it easier for prospective students to get the information they need quickly.
## How to Run
### Prerequisites
Python 3.8+
Node.js 14+
MongoDB
Flask
ReactJS
### Installation
Clone the Repository

git clone https://github.com/samhitmantrala8/nlpiiit

cd backend
## Optional
Create a virtual environment and activate it:
bash
Copy code
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
## Install the required Python packages:

-> pip install -r requirements.txt

Start the Flask server:

-> flask run
## Frontend Setup

Navigate to the frontend directory:

-> cd client


-> npm install

Start the React development server:

->npm run dev

Usage

Once the servers are running, you can access the chatbot through the local web server. Interact with the chatbot by asking questions about IIIT Jabalpur to receive detailed responses.
