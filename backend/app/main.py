# app/main.py
# Updated to include admin router

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base
from app.routers import auth, courses, institutions, tasks, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Edulytics Backend")

ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:3002",
    "http://localhost:3002"

}

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    origin = request.headers.get("origin")
    
    if request.method == "OPTIONS":
        response = Response()
    else:
        response = await call_next(request)
    
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

# Routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(institutions.router)
app.include_router(tasks.router)
app.include_router(admin.router)  # NEW

@app.get("/")
def read_root():
    return {"message": "Edulytics backend is running 🚀"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
