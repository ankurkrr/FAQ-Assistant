import os
import requests

API_URL = "https://router.huggingface.co/fireworks-ai/inference/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {os.environ['HF_TOKEN']}",
}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

response = query({
    "messages": [
        {
            "role": "user",
            "content": "What is the capital of France?"
        }
    ],
    "model": "accounts/fireworks/models/llama-v3p1-8b-instruct"
})

print(response["choices"][0]["message"])