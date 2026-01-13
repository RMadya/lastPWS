# BeanByte Open API

Premium Coffee Shop Management System with Open API Platform

## 🚀 Features

- **Dual Authentication**: JWT for web users + API Key for developers
- **Rate Limiting**: Free (100 req/day) & Premium (1000 req/day) tiers
- **Developer Portal**: API key management & usage analytics
- **Admin Dashboard**: Complete coffee shop management
- **Interactive API Docs**: Swagger/OpenAPI documentation
- **Modern UI**: Dark theme with glassmorphism effects

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone Repository
```bash
cd c:/lastPWS
```

### 2. Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Run the migration script
source backend/migrations/init.sql
```

### 3. Setup Backend
```bash
cd backend
npm install

# Copy environment file
copy .env.example .env

# Edit .env and configure your database credentials
# Then start the server
npm start
```

Backend will run on http://localhost:5000

### 4. Setup Frontend
```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## 📚 API Documentation

Access interactive API documentation at:
- **Swagger UI**: http://localhost:5000/api/docs
- **Frontend Docs**: http://localhost:5173/api-docs

## 🔑 Default Credentials

### Admin Account
- Email: `admin@beanbyte.com`
- Password: `admin123`

### Test User
- Email: `john@example.com`
- Password: `admin123`

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Coffees
- `GET /api/coffees` - Get all coffees
- `GET /api/coffees/:id` - Get coffee by ID
- `POST /api/coffees` - Create coffee (Admin)
- `PUT /api/coffees/:id` - Update coffee (Admin)
- `DELETE /api/coffees/:id` - Delete coffee (Admin)

### Orders
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (Admin)

### API Keys
- `POST /api/keys/generate` - Generate API key
- `GET /api/keys` - Get user's API keys
- `DELETE /api/keys/:id` - Delete API key
- `GET /api/keys/:id/usage` - Get usage statistics

## 🔐 Using API Keys

Include your API key in request headers:

```bash
curl -X GET http://localhost:5000/api/coffees \
  -H "X-API-Key: your-api-key-here"
```

## 👨‍💻 Developer

**Muhammad Bagas Prasetyo Rinaldi**
- NIM: 20230140143
- Class: C

## 📄 License

MIT License
