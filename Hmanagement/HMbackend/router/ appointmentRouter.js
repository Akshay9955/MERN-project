import express from "express";
import { getAllAppointments, bookAppointment , updateAppointmentStatus, deleteAppointment} from "../controllers/appointmentController.js";
import { isAdminAuthenticated , isPatientAuthenticated} from "../middlewares/auth.js";


const router = express.Router();

router.post("/post", isPatientAuthenticated, bookAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);



export default router;