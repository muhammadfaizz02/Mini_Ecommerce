from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base  # HAPUS TITIK (absolute import)
from routers import products, orders  # HAPUS TITIK
import os
from seed_data import seed_data  # IMPORT SEED DATA
from sqlalchemy.orm import Session
from database import SessionLocal
import models

# ENABLE DATABASE CREATION
Base.metadata.create_all(bind=engine)

# FUNGSI AUTO-SEED
def auto_seed():
    try:
        db = SessionLocal()
        if db.query(models.Product).count() == 0:
            seed_data()
            print("✅ Data seeded successfully!")
        else:
            print("✅ Data already exists, skipping seeding.")
        db.close()
    except Exception as e:
        print(f"❌ Seeding error: {e}")

# JALANKAN AUTO-SEED
auto_seed()

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

# Endpoint untuk test connection
@app.get("/db-status")
def db_status():
    try:
        db = SessionLocal()
        count = db.query(models.Product).count()
        db.close()
        return {
            "status": "connected",
            "tables_created": True,
            "products_count": count
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
