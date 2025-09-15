from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import products, orders

# Buat tabel database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce Mini API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])

@app.get("/")
def read_root():
    return {"message": "E-Commerce Mini API"}