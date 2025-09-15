from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from .database import engine, Base  # COMMENT
from .routers import products, orders
import os

# COMMENT SEMUA DATABASE OPERATIONS
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce Mini API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "https://mini-ecommerce-khaki-ten.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])

@app.get("/")
def read_root():
    return {"message": "E-Commerce Mini API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Tambahkan endpoint untuk test connection
@app.get("/db-status")
def db_status():
    return {
        "status": "database_operations_disabled",
        "message": "Database operations temporarily disabled for debugging"
    }
