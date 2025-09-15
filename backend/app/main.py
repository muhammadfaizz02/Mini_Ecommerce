from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import products, orders
import os

# Buat tabel database
Base.metadata.create_all(bind=engine)

# Auto-seeding data sample
try:
    from .seed_data import seed_data
    seed_data()
    print("✅ Sample data seeded successfully")
except Exception as e:
    print(f"⚠️ Seeding failed: {e}")

app = FastAPI(title="E-Commerce Mini API", version="1.0.0")

# Setup CORS untuk production
origins = [
    "http://localhost:3000",  # Local development
    "http://localhost:3001",  # Alternative local port
    "https://mini-ecommerce-khaki-ten.vercel.app",  # Remove trailing slash!
    "https://mini-ecommerce-khaki-ten.vercel.app",  # Your Vercel frontend
    "https://*.vercel.app",    # All Vercel deployments
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
    return {
        "message": "E-Commerce Mini API", 
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "database": "connected",
        "timestamp": "2024-01-01T00:00:00Z"  # You might want to use datetime.now()
    }

@app.get("/api")
def api_info():
    return {
        "endpoints": {
            "products": "/api/products",
            "orders": "/api/orders",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

# Error handling middleware (optional but recommended)
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
