from sqlalchemy.orm import Session, joinedload 
from . import models, schemas

def get_products(db: Session, skip: int = 0, limit: int = 100, category: str = None, min_price: float = None, max_price: float = None, sort_by: str = None):
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)

    if sort_by == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(models.Product.price.desc())
    elif sort_by == "name_asc":
        query = query.order_by(models.Product.name.asc())
    elif sort_by == "name_desc":
        query = query.order_by(models.Product.name.desc())
    else:
        query = query.order_by(models.Product.created_at.desc())
    
    return query.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_order(db: Session, order: schemas.OrderCreate):
    # Calculate total amount
    total_amount = sum(item.price * item.quantity for item in order.items)
    
    db_order = models.Order(
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_address=order.customer_address,
        total_amount=total_amount
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_order_with_products(db: Session, order_id: int):
    return db.query(models.Order).\
        options(
            joinedload(models.Order.items).joinedload(models.OrderItem.product)
        ).\
        filter(models.Order.id == order_id).\
        first()
