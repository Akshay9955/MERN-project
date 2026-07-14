import express from "express";
import { saveAddress, getAddress } from "../controllers/addressController.js";


const router = express.Router();

// Route to save a new address
router.post("/add", saveAddress);

// Route to fetch all addresses for a specific user
router.get("/:userId", getAddress);

export default router;