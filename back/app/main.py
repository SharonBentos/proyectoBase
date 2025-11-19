from app.db import conn
from dotenv import load_dotenv
from fastapi import FastAPI

_ = load_dotenv()

app = FastAPI()

_ = conn()

@app.get("/")
async def root():
    return {"message": "Hello World"}
