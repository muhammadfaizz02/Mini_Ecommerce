# orders.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload 
from .. import schemas, crud, database

router = APIRouter()

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    return crud.create_order(db=db, order=order)

@router.get("/", response_model=list[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    orders = crud.get_orders(db, skip=skip, limit=limit)
    return orders

@router.get("/{order_id}", response_model=schemas.OrderWithProducts)
def read_order(order_id: int, db: Session = Depends(database.get_db)):
    order = crud.get_order_with_products(db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order