# Frontend README

This is the frontend for the e-commerce application built with React and Vite.

## Tech Stack

- React
- Vite
- React Router
- Axios
- Tailwind CSS

## Features

- User authentication (login/signup)
- Product browsing and product details
- Shopping cart
- Checkout and address management
- Order success flow
- Admin product management pages

## Getting Started

1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server
   ```bash
   npm run dev
   ```

3. Open your browser at
   ```text
   http://localhost:5173
   ```

## Build for Production

```bash
npm run build
```

## Notes

- The frontend connects to the backend API at `http://localhost:3000/api`.
- Make sure the backend server is running before using the app.

## Project Structure

- src/pages: main pages such as Home, Login, Signup, Cart, and Checkout
- src/admin: admin pages for adding, editing, and listing products
- src/components: reusable UI components
- src/api: API configuration using Axios
