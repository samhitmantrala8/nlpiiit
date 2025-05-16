import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from services.pdf_service import get_pdf_text, get_text_chunks

EMBEDDING_MODEL = "models/embedding-001"

def get_vector_store(text_chunks, index_path):
    if os.path.exists(index_path):
        print(f"[INFO] FAISS index already exists at '{index_path}', skipping creation.")
        return

    print(f"[INFO] Creating FAISS index at '{index_path}'...")
    embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local(index_path)

def get_conversational_chain():
    prompt = PromptTemplate(
        template="""
        Answer the question as detailed as possible from the provided context.If there is not information related to that much then tell the user to visit the websites - https://iiitdmj.ac.in/ or https://www.collegepravesh.com/engineering-colleges/iiitdm-jabalpur/ or http://13.201.19.145:5000/
        Context:\n{context}\n
        Question:\n{question}\n
        Answer:""",
        input_variables=["context", "question"]
    )
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)

def process_question(user_question, pdf_filename):
    index_name = os.path.splitext(pdf_filename)[0]  # e.g., "geninfo"
    index_path = f"vectorstores/faiss_{index_name}"  # Save inside a folder for cleanliness

    # Create index if it doesn't exist
    if not os.path.exists(index_path):
        print(f"[INFO] Index '{index_path}' not found. Generating new embeddings...")
        text = get_pdf_text([pdf_filename])
        chunks = get_text_chunks(text)
        get_vector_store(chunks, index_path)
    else:
        print(f"[INFO] Using existing FAISS index at '{index_path}'")

    # Load the vector store
    embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
    db = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

    # Search & respond
    docs = db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return response["output_text"]
