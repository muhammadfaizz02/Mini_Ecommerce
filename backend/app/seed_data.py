# backend/app/seed_data.py
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import Product, Base

Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()

    existing_products = db.query(Product).count()
    if existing_products > 0:
        db.close()
        return
    
    sample_products = [
        Product(
            name="Smartphone XYZ",
            description="High-end smartphone with amazing camera and performance",
            price=699.99,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            stock=50
        ),
        Product(
            name="Wireless Headphones",
            description="Noise-cancelling wireless headphones with long battery life",
            price=199.99,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            stock=30
        ),
        Product(
            name="Running Shoes",
            description="Comfortable running shoes for everyday training",
            price=89.99,
            category="Fashion",
            image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            stock=75
        ),
        Product(
            name="Coffee Maker",
            description="Automatic coffee maker with programmable settings",
            price=129.99,
            category="Home",
            image_url="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
            stock=25
        ),
        Product(
            name="Backpack",
            description="Durable backpack with laptop compartment and water resistant",
            price=59.99,
            category="Fashion",
            image_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
            stock=40
        ),
        Product(
            name="Fitness Watch",
            description="Smart watch with heart rate monitoring and GPS",
            price=249.99,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            stock=20
        ),
        Product(
            name="Desk Lamp",
            description="LED desk lamp with adjustable brightness and color temperature",
            price=39.99,
            category="Home",
            image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            stock=60
        ),
        Product(
            name="Water Bottle",
            description="Insulated water bottle that keeps drinks cold for 24 hours",
            price=34.99,
            category="Lifestyle",
            image_url="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
            stock=100
        )
    ]
    
    for product in sample_products:
        db.add(product)
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_data()