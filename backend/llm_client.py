import os
from dotenv import load_dotenv
from faq_context import FAQ_CONTEXT
from transformers import pipeline

load_dotenv()
HF_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")  # Optional for local usage

def ask_llm(question: str) -> str:
    
    try:
        # Initialize the local model (google/flan-t5-base)
        generator = pipeline("text2text-generation", model="google/flan-t5-base")

        # Ensure FAQ_CONTEXT is a string
        faq_content = FAQ_CONTEXT if isinstance(FAQ_CONTEXT, str) else str(FAQ_CONTEXT)

        # Construct the prompt
        prompt = f"""You are an FAQ assistant. Only answer using the information provided in the FAQ below.
If the answer is not found in the FAQ, respond with "Sorry, I can't answer that."

FAQ:
{faq_content}

Question: {question}
Answer: """

        # Generate response
        result = generator(prompt, max_length=256, num_return_sequences=1)[0]["generated_text"]
        
        # Extract the answer
        if "Answer:" in result:
            answer = result.split("Answer:")[-1].strip()
        elif result.startswith(prompt):
            answer = result[len(prompt):].strip()
        else:
            answer = result.strip()

        return answer if answer else "Sorry, I can't answer that."

    except Exception as e:
        return f"Error running local model: {e}"