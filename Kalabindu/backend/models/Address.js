import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
   userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
   },
   fullName:{
    type: String,
    required: true
   },
   phone:{
    type: Number,
    required: true
   },
   address:{
    type: String,
    required: true
   },
   city:{
    type: String,
    required: true
   },
   state:{
    type: String,
    required: true
   },
   pincode:{
    type: Number,
    required: true  
   },
   Country: String,


},{
    timestamps: true
});

export default mongoose.model('Address', addressSchema);