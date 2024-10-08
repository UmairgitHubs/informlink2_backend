import express from "express";
import { LoginUser, RegisterUser } from "../controller/index.js";
import { generateAndSendOTP } from "../controller/otp.js";

const Router = express.Router();

Router.post("/login-user", LoginUser);
Router.post("/register-user", RegisterUser);
Router.post("/send-otp", generateAndSendOTP);
// Router.use("*", (req, res) => {
//   res.status(404).json({ error: "Requested Endpoint not Found !" });
// });

export default Router;
