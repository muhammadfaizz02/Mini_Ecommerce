import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

print("=== DATABASE DEBUG INFO ===")
print(f"RAILWAY_ENVIRONMENT: {os.getenv('RAILWAY_ENVIRONMENT')}")
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
print(f"MYSQLHOST: {os.getenv('MYSQLHOST')}")
print(f"MYSQLDATABASE: {os.getenv('MYSQLDATABASE')}")
print(f"MYSQLPASSWORD: {'*' * len(os.getenv('MYSQLPASSWORD', ''))}")
print(f"MYSQLUSER: {os.getenv('MYSQLUSER')}")
print("===========================")

# Determine database URL
database_url = os.getenv('DATABASE_URL')

if not database_url:
    # Check if we're in Railway environment
    if os.getenv('RAILWAY_ENVIRONMENT'):
        # Railway production - construct from individual variables
        host = os.getenv('MYSQLHOST')
        database = os.getenv('MYSQLDATABASE')
        password = os.getenv('MYSQLPASSWORD')
        user = os.getenv('MYSQLUSER', 'root')
        
        # Check if all required variables are present
        missing_vars = []
        if not host: missing_vars.append('MYSQLHOST')
        if not database: missing_vars.append('MYSQLDATABASE')
        if not password: missing_vars.append('MYSQLPASSWORD')
        
        if missing_vars:
            print(f"WARNING: Missing MySQL variables: {missing_vars}")
            # Fallback to local for now instead of crashing
            database_url = "mysql+mysqlconnector://root:@localhost/ecommerce_db"
            print("Falling back to local development database")
        else:
            database_url = f"mysql://{user}:{password}@{host}:3306/{database}"
            print(f"Constructed Railway DATABASE_URL: {database_url}")
    else:
        # Local development
        database_url = "mysql+mysqlconnector://root:@localhost/ecommerce_db"
        print("Using local development database")
else:
    print(f"Using provided DATABASE_URL: {database_url}")

# Fix URL format untuk SQLAlchemy
if database_url.startswith("mysql://"):
    database_url = database_url.replace("mysql://", "mysql+mysqlconnector://")
    print(f"Fixed DATABASE_URL: {database_url}")

SQLALCHEMY_DATABASE_URL = database_url

print(f"Final SQLALCHEMY_DATABASE_URL: {SQLALCHEMY_DATABASE_URL}")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
