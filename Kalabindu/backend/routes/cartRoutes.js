import express from "express";
import {addToCart, getCart, removeItem, updateQuantity} from "../controllers/cartController.js";
import {authenticate} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/add', authenticate, addToCart);
router.post('/remove', authenticate, removeItem);
router.post('/update', authenticate, updateQuantity);
router.get('/:userId', authenticate, getCart);


export default router;

