import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Debug: Print semua environment variables terkait database
print("=== DATABASE ENVIRONMENT VARIABLES ===")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
print(f"MYSQLHOST: {os.getenv('MYSQLHOST')}")
print(f"MYSQLDATABASE: {os.getenv('MYSQLDATABASE')}")
print("======================================")

# Prioritaskan DATABASE_URL, jika tidak ada gunakan variable lainnya
database_url = os.getenv('DATABASE_URL')
if not database_url:
    # Construct DATABASE_URL dari individual variables
    host = os.getenv('MYSQLHOST', 'mysql.railway.internal')
    database = os.getenv('MYSQLDATABASE', 'railway')
    password = os.getenv('MYSQLPASSWORD', 'BFFHoYLBITIncMbodbJxxuEOIpMLqscT')
    database_url = f"mysql://root:{password}@{host}:3306/{database}"
    print(f"Constructed DATABASE_URL: {database_url}")

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
