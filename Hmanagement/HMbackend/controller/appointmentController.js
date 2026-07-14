import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const bookAppointment = catchAsyncError(async(req, res, next) =>{
     const {

         firstName,
         lastName,
         email,
         phone,
           nic, 
           dob,
           gender,
           appointment_date,
           department,
           doctor_firstName,
           doctor_lastName,
           hasVisited,
           address,

           
     } = req.body;

     if(
            !firstName ||            !lastName ||
            !email ||            !phone ||
            !nic ||            !dob ||
            !gender ||            !appointment_date ||
            !department ||            !doctor_firstName ||
            !doctor_lastName ||            
            !address      
     ){
            return next(new ErrorHandler("Please fill all the fields", 400));
     }
     const isConflict = await User.find({
          firstName: doctor_firstName,
          lastName: doctor_lastName,
          role:"doctor",
          doctorDepartment: department
     })
     if (isConflict.length === 0 ){
          return next(new ErrorHandler("No doctor found with the provided details", 404));
     }
      if (isConflict.length > 1 ){
          return next(new ErrorHandler("Doctor conflict! please contact through email or phone!", 400));
     }
     const doctorId = isConflict[0]._id;
     const patientId = req.user._id;
      const appointment = await Appointment.create ({
           firstName,
           lastName,
           email,
           phone,
           nic,
           dob,
           gender,
               appointment_date,
               department,
               doctor:{
                    firstName: doctor_firstName,
                    lastName: doctor_lastName,
               },
               hasVisited,
               doctorId,
               patientId,
               address,
               doctorId,
               patientId
      });
      res.status(200).json({
         success: true,
         message: "Appointment Sent successfully!",

      })   
});


export const getAllAppointments = catchAsyncError(async(req, res, next) =>{
    const appointments = await Appointment.find();
    res.status(200).json({
     success:true,
     appointments,
    })

});

export const updateAppointmentStatus = catchAsyncError(async(req, res, next) =>{
     const {appointmentId} = req.params;
     const appointment = await Appointment.findById(appointmentId);
     if (!appointment) {
          return next(new ErrorHandler("Appointment not found", 404));
     }
     appointment.status = req.body.status;
     await appointment.save();
     res.status(200).json({
          success: true,
          message: "Appointment status updated successfully!",
          appointment
     });
});

export const deleteAppointment = catchAsyncError(async(req, res, next) =>{
     const {appointmentId} = req.params;
     const appointment = await Appointment.findById(appointmentId);
     if (!appointment) {
          return next(new ErrorHandler("Appointment not found", 404));
     }
     await appointment.remove();
     res.status(200).json({
          success: true,
          message: "Appointment deleted successfully!",
     });
});

