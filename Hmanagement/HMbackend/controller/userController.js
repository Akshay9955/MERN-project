import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncError(async (req, res, next) =>{
    const{firstName, lastName , email, phone, password, gender, dob, nic, role } = req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role)
    {
        return next(new ErrorHandler("Please fill out the entire form!", 400));
    }
    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    });
    generateToken(user, "User registered successfully", 200, res);
  });

export const login = catchAsyncError(async (req, res, next) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please provide email and password!", 400));
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    generateToken(user, "User logged in successfully", 200, res);

});

export const addNewAdmin = catchAsyncError(async (req, res, next) =>{
       const{firstName, lastName , email, phone, password, gender, dob, nic, } = req.body;
         if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic )
    {
        return next(new ErrorHandler("Please fill out the entire form!", 400));
    }
     const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler( `${isRegistered.role} with this email already exists`, 400));
    }
    const admin = await User.create({
       firstName, lastName , email, phone, password, gender, dob, nic, role: "Admin"
    });
    res.status(200).json({
        success: true,
        message: "Admin registered successfully",
        admin
      });
      
    });

    export const getAllDoctors = catchAsyncError(async (req, res, next) =>{
        const doctors = await User.find({role: "Doctor"});
        res.status(200).json({
           success: true,
           doctors
        });
    });

    export const getUserDetails = catchAsyncError(async (req, res, next) =>{
        const user = req.user;
        res.status(200).json({
            success: true,
            user
        });
    });

    export const adminLogout = catchAsyncError(async (req, res, next) =>{
        res.status(200).cookie("adminToken", "", {
            expires : new Date(Date.now()),
            httpOnly: true,
        })
        .json({
            success: true,
            message: "Admin logged out successfully",
        });
    });

    export const patientLogout = catchAsyncError(async (req, res, next) =>{
        res.status(200).cookie("patientToken", "", {
            expires : new Date(Date.now()),
            httpOnly: true,
        }).json({
            success: true,
            message: "Patient logged out successfully",
        })
    });

    export const addNewDoctor = catchAsyncError(async(req, res , next)=>{
        if (!req.files || Object.keys(req.files).length === 0){
            return next(new ErrorHandler("Doctor Avatar required!", 400));
        }
        const { docAvatar}= req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormats.includes(docAvatar.mimetype)){
            return next(new ErrorHandler("Only png, jpeg and webp formats are allowed!", 400));
        }
        const{
         firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment
      
        } = req.body;
        if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment){
            return next(new ErrorHandler("Please fill out the entire form!", 400));
        }
         const isRegistered = await User.findOne({email});
         if(isRegistered){
             return next(new ErrorHandler( `${isRegistered.role} with this email already exists`, 400));
         }
          const cloudinaryResponse = await cloudinary.v2.uploader.upload(docAvatar.tempFilePath, 
          );
          if (!cloudinaryResponse || cloudinaryResponse.error){
             console.error(
                "cloudinary upload error:", cloudinaryResponse.console.error|| "unknown cloudinary error"
             );
          }
            const doctor = await User.create({
                firstName,
                lastName,
                email,
                phone,
                password,
                gender,
                dob,
                nic,
                doctorDepartment,
                role: "Doctor",
                docAvatar:{
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url,
                },
            });
            res.status(200).json({
                success: true,
                message: "new doctor added successfully",
                doctor
            })
         
        });