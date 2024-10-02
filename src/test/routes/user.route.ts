import express from "express"
import { userController } from "../controllers/user.controller";
const router = express.Router();

router.route("/").get(userController.findAll);
router.route("/").post(userController.addUser);
// router.route("/").get(userController.findOne);

export const userRoutes = router;