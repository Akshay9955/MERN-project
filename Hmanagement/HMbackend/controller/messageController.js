import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const sendMessage = catchAsyncError(async(req, res, next) =>{
 
        const {firstName, lastName, email, phone, message} =req.body;
        console.log("Request Body Received:", req.body);
        if ( !firstName || !lastName || !email || !phone || !message){
            return next(new ErrorHandler("please fill all the fields", 400));
        }
        await Message.create({firstName, lastName, email, phone, message });
        res.status(200).json({
            success: true,
            message: "message send successfully!",
        });
    }) ;

    export const getAllMessages = catchAsyncError(async(req, res, next) =>{
        const messages = await Message.find();
        res.status(200).json({
            success: true,
            messages,
        });
    });