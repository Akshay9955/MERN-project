import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";



dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoutes);





// app.get('/', (req, res)=>{
//     res.send('API is running...')
// })


connectDB();
app.listen(3000, console.log('Server started on port 3000'));   










// import express from "express";
// import cors from "cors";

// const app = express();

// // 1. Define your trusted web app domains
// const allowedOrigins = [
//   "http://localhost:5173",       // Your local frontend development environment (e.g., Vite/React)
//   "https://my-ecommerce.com" // Your live production frontend domain website
// ];

// // 2. Configure safe CORS rule logic
// const corsOptions = {
//   origin: (origin, callback) => {
//     // Allow requests with no origin (like mobile apps, curl, or Postman testing)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.includes(origin)) {
//       // Origin is safe, let the browser request pass through
//       callback(null, true);
//     } else {
//       // Block untrusted domain request
//       callback(new Error("Blocked by secure CORS architecture rules"));
//     }
//   },
//   // Allows cookies and Authorization bearer tokens to securely travel back and forth
//   credentials: true, 
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// };

// // 3. Inject the secured middleware block
// app.use(cors(corsOptions));

// app.use(express.json());
