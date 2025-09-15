# products.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from .. import schemas, crud, database

router = APIRouter()

@router.get("/", response_model=list[schemas.Product])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    products = crud.get_products(
        db, skip=skip, limit=limit, 
        category=category, min_price=min_price, max_price=max_price
    )
    return products

@router.get("/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(database.get_db)):
    product = crud.get_product(db, product_id=product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product