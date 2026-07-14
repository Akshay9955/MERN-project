// const mongoose = require('mongoose');

// // 1. Define the sub-document structure for individual items inside the cart
// const CartItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product', // References your existing Product collection model
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: [1, 'Quantity cannot be less than 1.'],
//     default: 1
//   },
//   pricePerUnit: {
//     type: Number,
//     required: true // Saved at addition time to preserve pricing snapshots
//   }
// }, { _id: false }); // Disable separate IDs for nested array items to clean up responses

// // 2. Define the main Cart structure linked to a single specific User
// const CartSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // References your User collection model
//     required: true,
//     unique: true // Ensures a user can only own exactly one active cart document
//   },
//   items: [CartItemSchema], // Array nesting our items defined above
//   billDetails: {
//     totalItemsPrice: { type: Number, required: true, default: 0 },
//     deliveryCharges: { type: Number, required: true, default: 0 }, // E.g., Free over $500 like Flipkart
//     securedPackagingFee: { type: Number, required: true, default: 0 }, // Flipkart specific add-ons
//     totalAmount: { type: Number, required: true, default: 0 }
//   }
// }, { 
//   timestamps: true // Automatically tracks createdAt and updatedAt properties
// });

// // 3. Pre-save Middleware: Automatically compute total amounts before saving to MongoDB
// CartSchema.pre('save', function (next) {
//   if (this.items.length === 0) {
//     this.billDetails.totalItemsPrice = 0;
//     this.billDetails.deliveryCharges = 0;
//     this.billDetails.securedPackagingFee = 0;
//     this.billDetails.totalAmount = 0;
//     return next();
//   }

//   // Calculate items total cost
//   this.billDetails.totalItemsPrice = this.items.reduce((total, item) => {
//     return total + (item.quantity * item.pricePerUnit);
//   }, 0);

//   // Flipkart Style Rule: Free delivery for items total above $40, otherwise $4 delivery charge
//   this.billDetails.deliveryCharges = this.billDetails.totalItemsPrice > 40 ? 0 : 4;
  
//   // Flipkart Style Rule: Flat packaging safety handling fee
//   this.billDetails.securedPackagingFee = 2;

//   // Final Total Amount Invoice Value
//   this.billDetails.totalAmount = 
//     this.billDetails.totalItemsPrice + 
//     this.billDetails.deliveryCharges + 
//     this.billDetails.securedPackagingFee;

//   next();
// });

// module.exports = mongoose.model('Cart', CartSchema);


// import mongoose from "mongoose";

// const CartSchema = new mongoose.Schema({
//     userId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required: true
//     },
//      items:[
//         {
//             productId:{
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Product",
//                 required: true
//             },
//             quantity:{
//                 type: Number,
                
//                 min: [1, "Quantity cannot be less than 1."]
//             },
          
//         }
//      ]
// });

// export default mongoose.model('Cart', CartSchema)



import mongoose from 'mongoose';

// 1. Define the sub-document structure for individual items inside the cart
const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // References your existing Product collection model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1.'],
    default: 1
  },
  pricePerUnit: {
    type: Number,
    required: true,
    default: 0 // Default to 0 for legacy items to avoid validation errors
  }
}, { _id: false }); // Disable separate IDs for nested array items to clean up responses

// 2. Define the main Cart structure linked to a single specific User
const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References your User collection model
    required: true,
    unique: true // Guarantees each user only has one active cart document
  },
  items: [CartItemSchema]
}, { timestamps: true });

// Export default for ES Modules
export default mongoose.model('Cart', CartSchema);

