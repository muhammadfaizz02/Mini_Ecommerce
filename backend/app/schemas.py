from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    image_url: Optional[str] = None
    stock: int = 0

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    
    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_address: str
    items: List[OrderItemCreate]

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItem]
    
    class Config:
        orm_mode = True

class OrderItemWithProduct(OrderItem):
    product: Optional[Product] = None
    
    class Config:
        orm_mode = True

class OrderWithProducts(Order):
    items: List[OrderItemWithProduct] = []
    
    class Config:
        orm_mode = True
