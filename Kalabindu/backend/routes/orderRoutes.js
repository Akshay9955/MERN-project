import express from "express";
import { placeOrder, getUserOrders } from "../controllers/orderController.js"; 

const router = express.Router();


router.post("/place", placeOrder);

// GET:  http://localhost:5000/api/orders/user/:userId
router.get("/user/:userId", getUserOrders);

export default router;