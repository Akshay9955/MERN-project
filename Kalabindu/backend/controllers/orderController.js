import Order from "../models/Order.js";
import Address from "../models/Address.js";




// Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, addressId, totalAmount, paymentMethod } = req.body;

    // 1. Validate required input payloads
    if (!userId || !items || items.length === 0 || !addressId || !totalAmount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required order details."
      });
    }

    // 2. Fetch the target address to create an unchangeable order snapshot
    const originalAddress = await Address.findById(addressId);
    if (!originalAddress) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found."
      });
    }

    // 3. Construct the order document matching your schema layout
    const newOrder = new Order({
      userId,
      items,
      shippingAddress: {
        fullName: originalAddress.fullName,
        phone: originalAddress.phone,
        address: originalAddress.address,
        city: originalAddress.city,
        state: originalAddress.state,
        pincode: originalAddress.pincode,
        Country: originalAddress.Country
      },
      totalAmount,
      paymentMethod,
      status: "Pending" // Automatically falls back to Pending via schema, stated here for clarity
    });

    // 4. Save order records to the MongoDB database
    const savedOrder = await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id,
      data: savedOrder
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while processing order",
      error: error.message
    });
  }
};

// Get order history for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID parameter is required."
      });
    }

    // Fetch orders, populated with product names (if reference exists) sorted by newest first
    const orders = await Order.find({ userId })
      .populate("items.productId", "name price image") // Optional: details from Product model if available
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching order history",
      error: error.message
    });
  }
};
