# Karigari E-Commerce Platform

-Github Link : https://github.com/chiefsujal/Ecom 
-Youtube Link : https://youtu.be/9kZuiysqyjM 
-Documentation Link : https://weak-faucet-34d.notion.site/Karigari-214867a5ee9280d78670cad4c8c7d847

A modern, full-stack e-commerce platform designed for artisans and small businesses to manage their online presence.

## Key Features

- User authentication and authorization
- Product browsing and management
- Customer review and rating system
- Admin controls for product management
- Secure file upload handling

## Tech Stack

- Frontend: React with Vite, Tailwind CSS, DaisyUI
- Backend: Node.js, Express
- Database: PostgreSQL (Neon)
- Authentication: JWT, bcryptjs
- 
# Getting Started
## Prerequisites
- Node.js installed- PostgreSQL database (Neon)

## Installation Steps
1. Clone the Repository
```bash
git clone [repository-url]

```
1. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend/ecom && npm install

```
These commands will install all necessary packages for both backend and frontend.

1. Environment Setup
Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
NODE_ENV=production
PGHOST=your_db_host
PGDATABASE=your_db_name
PGUSER=your_db_user
PGPASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
ARCJET_KEY=your_arcjet_key

```
1. Start Development Servers

```bash
# Start backend server
npm run dev

# Start frontend server (in a new terminal)
cd ../frontend/ecom && npm run dev
```
This will start both the backend and frontend development servers.
1. Testing
You can test the API endpoints using Postman or curl.
The application should now be running locally and ready for development!

## Future Development

- Complete Add, Delete and Edit functionality
- Shopping cart and checkout system
- Payment integration
- Admin dashboard with analytics

For detailed documentation, please refer to the project documentation.
