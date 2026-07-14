import express from "express";
import {
  getAllAppointments,
  bookAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controller/appointmentController.js";
import { isAdminAuthenticated , isPatientAuthenticated} from "../middlewares/auth.js";


const router = express.Router();

router.post("/post", isPatientAuthenticated, bookAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:appointmentId", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:appointmentId", isAdminAuthenticated, deleteAppointment);



export default router;