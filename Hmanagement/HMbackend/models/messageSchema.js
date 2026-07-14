import mongoose from "mongoose";
import validator from "validator"


const messageSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:[3 , "First name contain at least 3 characters!"]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3, "Last name contain at least 3 character!"]
    },
    email:{
        type : String,
        required: true,
        validate: [validator.isEmail, "please provide a valid email!"]
    },
    phone:{
        type: String,
        required: true,
        minLength: [10,"phone number must contain exact 10 digits!"],
        maxLength: [10, "phone number must contain exact 10 digits!"],
    },
      message:{
        type: String,
        required: true,
        minLength: [10,"Message must contain at least 10 characters!"],
    },
    
});

export const Message = mongoose.model("message" , messageSchema);