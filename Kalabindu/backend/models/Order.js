import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product' // Assumes you have or will create a Product model
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1.']
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  // Embedding the address fields directly so historical order records stay accurate 
  // even if the user later deletes or updates their address from the address book
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    Country: { type: String, default: "India" }
  },
  totalAmount: {
    type: Number,
    
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: {
      values: ['COD', 'UPI'],
      message: '{VALUE} is not a supported payment method'
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

export default mongoose.model('Order', orderSchema);
