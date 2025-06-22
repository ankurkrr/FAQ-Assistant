from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from auth import create_access_token, verify_token
from llm_client import ask_llm
from typing import Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hardcoded user
USER_DB = {
    "admin": "password123"
}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    
    if USER_DB.get(form_data.username) != form_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/ask")
async def ask_question(question: Dict[str, str], authorization: str = Header(...)):
    
    # Validate authorization header
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split("Bearer ")[1]
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Validate question input
    if "question" not in question or not isinstance(question["question"], str):
        raise HTTPException(status_code=400, detail="Invalid question format. Provide a 'question' key with a string value.")

    answer = ask_llm(question["question"])
    return {"answer": answer}