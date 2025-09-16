from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from .database import engine, Base
from .routers import products, orders

app = FastAPI(title="E-Commerce Mini API", version="1.0.0")

# Uncomment jika ingin membuat tabel otomatis
Base.metadata.create_all(bind=engine)

# CORS settings
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

# Include routers
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "E-Commerce Mini API"}

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# DB status check (actual connection test)
@app.get("/db-status")
def db_status():
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return {"status": "ok", "message": "Database connection successful"}
    except SQLAlchemyError as e:
        return {"status": "error", "message": str(e)}
