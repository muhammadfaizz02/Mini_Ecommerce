from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

# Import dengan absolute path
from app.database import engine, Base, SessionLocal, get_db
from app import models
from app.routers import products, orders
from app.seed_data import seed_data

# UNCOMMENT - ENABLE DATABASE CREATION
Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce Mini API", version="1.0.0")

# FUNGSI AUTO-SEED
@app.on_event("startup")
def startup_event():
    try:
        print("🔄 Checking and seeding database...")
        db = SessionLocal()
        product_count = db.query(models.Product).count()
        if product_count == 0:
            print("🌱 Seeding database...")
            seed_data()
            print("✅ Database seeded successfully!")
        else:
            print(f"✅ Database already has {product_count} products")
        db.close()
    except Exception as e:
        print(f"❌ Startup error: {str(e)}")

# Configure CORS
origins = [
    "http://localhost:3000",
    "https://mini-ecommerce-khaki-ten.vercel.app",
    "https://miniecommerce-production.up.railway.app"
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

@app.get("/db-status")
def db_status(db: Session = Depends(get_db)):
    try:
        product_count = db.query(models.Product).count()
        return {
            "status": "connected",
            "tables_created": True,
            "products_count": product_count
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
