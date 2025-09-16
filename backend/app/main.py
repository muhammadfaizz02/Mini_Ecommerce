from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

# Relative imports untuk struktur package
from .database import engine, Base, SessionLocal
from . import models
from .seed_data import seed_data
from .routers import products, orders

# ENABLE DATABASE CREATION
Base.metadata.create_all(bind=engine)

# FUNGSI AUTO-SEED
def auto_seed():
    try:
        db = SessionLocal()
        product_count = db.query(models.Product).count()
        if product_count == 0:
            print("🌱 Seeding database with sample data...")
            seed_data()
            print("✅ Data seeded successfully!")
        else:
            print(f"✅ Database already has {product_count} products, skipping seeding.")
        db.close()
    except Exception as e:
        print(f"❌ Seeding error: {str(e)}")

# JALANKAN AUTO-SEED SAAT STARTUP
auto_seed()

app = FastAPI(title="E-Commerce Mini API", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:3000",
    "https://mini-ecommerce-khaki-ten.vercel.app",
    "http://localhost:8080",
    "https://miniecommerce-production.up.railway.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])

@app.get("/")
def read_root():
    return {"message": "E-Commerce Mini API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ecommerce-api"}

# Endpoint untuk test database connection
@app.get("/db-status")
def db_status():
    try:
        db = SessionLocal()
        product_count = db.query(models.Product).count()
        db.close()
        return {
            "status": "connected",
            "database": "ready",
            "tables_created": True,
            "products_count": product_count
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "database": "unavailable"
        }

# Test endpoint untuk debug
@app.get("/test-imports")
def test_imports():
    return {
        "database_engine": str(type(engine)),
        "base_model": str(type(Base)),
        "models_imported": True,
        "seed_data_imported": True,
        "routers_imported": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
