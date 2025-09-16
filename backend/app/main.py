from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import products, orders

# Buat semua tabel sesuai models.py
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce Mini API", version="1.0.0")

# Izinkan akses dari frontend lokal & vercel
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

# Daftar router
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])


@app.get("/")
def read_root():
    return {"message": "E-Commerce Mini API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/db-status")
def db_status():
    """
    Endpoint untuk cek apakah DB sudah siap.
    """
    try:
        # Coba bikin tabel kalau belum ada
        models.Base.metadata.create_all(bind=engine)
        return {"status": "ok", "message": "Database connected and tables are ready"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
