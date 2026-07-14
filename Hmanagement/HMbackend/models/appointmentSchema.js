import mongoose  from "mongoose";
import validator from "validator"

const appointmentSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:[3 , "First name contain at least 3 characters!"]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3, "Last name must contain at least 3 characters!"]
    },
    email:{
        type : String,
        required: true,
        validate: [validator.isEmail, "please provide a valid email!"]
    },
    phone:{
        type: String,
        required: true,
        minLength: [10, "Phone number must contain exactly 10 digits!"],
        maxLength: [10, "Phone number must contain exactly 10 digits!"],
    },
      nic:{
        type: String,
        required: true,
        minLength: [10, "NIC must contain exactly 10 digits!"],
        maxLength: [10, "NIC must contain exactly 10 digits!"],
      }, 
      dob:{
        type: Date,
        required: [true, "dob is required!;"],
      },
      gender:{
        type: String,
        required: true,
        enum:["Male", "Female", "Other"],
      },

      appointment_date: {
         type: String,
         required: true,
      },
      department:{
        type: String,
        required: true,
      },
      doctor:{
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
            required: true,
        },
      },
    
      hasVisited:{
        type: Boolean,
        default: false,
      },

      doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      patientId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      address:{
        type: String,
        required: true,
      },
      status:{
        type: String,
        required: true,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
        default: "Pending",
      },   
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);