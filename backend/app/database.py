import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

print("=== DATABASE CONFIGURATION ===")

# Gunakan DATABASE_URL jika ada
database_url = os.getenv('DATABASE_URL')

if not database_url:
    # Construct dari individual variables - TANPA DEFAULT PASSWORD!
    host = os.getenv('MYSQLHOST')
    database = os.getenv('MYSQLDATABASE')
    password = os.getenv('MYSQLPASSWORD')  # ← TANPA DEFAULT VALUE!
    user = os.getenv('MYSQLUSER', 'root')
    
    if all([host, database, password]):
        database_url = f"mysql://{user}:{password}@{host}:3306/{database}"
        print(f"Constructed DATABASE_URL: {database_url}")
    else:
        # Fallback ke localhost untuk development
        database_url = "mysql+mysqlconnector://root:@localhost/ecommerce_db"
        print("Using local development database")
else:
    print(f"Using provided DATABASE_URL: {database_url}")

# Fix URL format untuk SQLAlchemy
if database_url.startswith("mysql://"):
    database_url = database_url.replace("mysql://", "mysql+mysqlconnector://")
    print(f"Fixed DATABASE_URL: {database_url}")

SQLALCHEMY_DATABASE_URL = database_url

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
