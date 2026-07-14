import express from "express";
import { login, patientRegister, addNewAdmin , getAllDoctors,addNewDoctor, getUserDetails, adminLogout, patientLogout} from "../controller/userController.js";
 import { isAdminAuthenticated , isPatientAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/register", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get ("/admin/me", isAdminAuthenticated , getUserDetails);
router.get ("/patient/me", isPatientAuthenticated , getUserDetails)
router.get ("/admin/logout", isAdminAuthenticated , adminLogout);
router.get ("/patient/logout", isPatientAuthenticated, patientLogout);
router.post ("/doctor/register", isAdminAuthenticated, addNewDoctor);


export default router;
