# 🛍️ Mini E-Commerce Application

Aplikasi e-commerce sederhana yang dibangun dengan React TypeScript (Frontend), FastAPI Python (Backend), dan MySQL (Database). Aplikasi ini memungkinkan pengguna untuk melihat produk, menambahkannya ke keranjang, dan melakukan checkout.

## 🚀 Fitur Utama

- ✅ Daftar produk dengan pagination dan filtering
- ✅ Pencarian dan filter produk (kategori, harga)
- ✅ Keranjang belanja
- ✅ Checkout sebagai guest
- ✅ Halaman daftar pesanan
- ✅ Detail pesanan
- ✅ Responsive design dengan Tailwind CSS
- ✅ Type safety dengan TypeScript dan Pydantic

## 🛠️ Teknologi yang Digunakan

### Backend
- **Python 3.8+**
- **FastAPI** - Web framework modern
- **SQLAlchemy** - ORM database
- **MySQL** - Database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Library UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing

## 📦 Instalasi dan Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/muhammadfaizz02/Mini_Ecommerce.git
cd Mini_Ecommerce

2. Setup Backend
Install Dependencies Backend
bash
cd backend
python -m venv venv
# Untuk Windows
venv\Scripts\activate
# Untuk Linux/Mac
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pymysql python-multipart pydantic email-validator
pip install python-jose[cryptography] passlib[bcrypt]
pip install -r requirements.txt


Dependencies Backend:
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pymysql==1.1.0
python-multipart==0.0.6
email-validator==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

Setup Database MySQL
Buat database MySQL:

sql
CREATE DATABASE ecommerce_db;

Update koneksi database di backend/app/database.py:

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://username:password@localhost/ecommerce_db"
Jalankan migrasi dan seed data:

bash
python -m app.seed_data

Jalankan Backend
bash
uvicorn app.main:app --reload

Backend akan berjalan di http://localhost:8000

3. Setup Frontend
Install Dependencies Frontend
bash
npx create-react-app frontend --template typescript
cd frontend
npm install
npm install axios react-router-dom @types/react-router-dom
npm install -D tailwindcss postcss autoprefixer

Dependencies Frontend:
react: ^18.2.0
react-dom: ^18.2.0
react-router-dom: ^6.8.0
axios: ^1.4.0
tailwindcss: ^3.3.0
@types/react: ^18.2.0
@types/react-dom: ^18.2.0
typescript: ^4.9.0

Jalankan Frontend
bash
npm start
Frontend akan berjalan di http://localhost:3000

🗂️ Struktur Proyek
text
Mini_Ecommerce/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── crud.py              # CRUD operations
│   │   ├── seed_data.py         # Sample data
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── products.py      # Products endpoints
│   │       └── orders.py        # Orders endpoints
│   ├── requirements.txt
│   └── requirements_test.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # Utility functions
│   │   └── App.tsx              # Main App component
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md

🧪 Testing
Backend Testing
bash
cd backend
pip install -r requirements_test.txt
pytest

Frontend Testing
bash
cd frontend
npm test

📋 API Endpoints
Products
GET /api/products/ - Get all products dengan pagination
GET /api/products/{product_id} - Get product by ID
Query parameters: page, limit, category, min_price, max_price, sort_by
Orders
GET /api/orders/ - Get all orders
GET /api/orders/{order_id} - Get order by ID
POST /api/orders/ - Create new order

🎨 Fitur UI/UX
Responsive Design - Bekerja baik di desktop dan mobile
Loading States - Feedback visual selama loading
Error Handling - Menampilkan error dengan jelas
Interactive Filters - Filter real-time dengan debouncing
Cart System - Sidebar cart yang interaktif
Order Tracking - Timeline status pesanan
