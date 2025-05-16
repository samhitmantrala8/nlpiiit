import google.generativeai as genai

fallback_words = [
    "sorry", "don't", "have", "information", "related", "query",
    "context", "does", "not", "mention", "anything", "I", "cannot",
    "answer", "question", "provided"
]

def needs_fallback(response_text):
    words = response_text.lower().split()
    if len(words) > 30:
        return False
    return sum(1 for word in fallback_words if word in words) >= 3

def generate_fallback_response(user_question):
    model = genai.GenerativeModel('gemini-1.5-pro')
    return model.generate_content(user_question).text
