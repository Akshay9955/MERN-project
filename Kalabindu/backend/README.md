# Backend README

This is the backend for the e-commerce application built with Node.js, Express, and MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- CORS support

## Features

- User signup and login
- Product creation, retrieval, update, and deletion
- Cart management
- Address management
- Order handling
- Authentication middleware for protected routes

## Getting Started

1. Install dependencies
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the backend folder and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. Start the server
   ```bash
   npm start
   ```

4. The API will run at:
   ```text
   http://localhost:3000
   ```

## API Base URL

```text
http://localhost:3000/api
```

## Main Routes

- Auth: `/api/auth`
- Products: `/api/products`
- Cart: `/api/cart`
- Address: `/api/address`
- Orders: `/api/orders`

## Project Structure

- config: database connection setup
- controllers: business logic for routes
- middleware: authentication checks
- models: Mongoose schemas
- routes: API route definitions
- server.js: entry point for the Express app

## Notes

- The backend expects a running MongoDB instance.
- Make sure the frontend is configured to call the backend on port 3000.
