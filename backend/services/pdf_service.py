import os
import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_path = os.path.join("pdfs", pdf)
        pdf_document = fitz.open(pdf_path)
        for page in pdf_document:
            text += page.get_text()
    return text

def get_text_chunks(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return splitter.split_text(text)
