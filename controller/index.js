import User from "../model/user.js";
import {
  registerSchemaValidation,
  LoginschemaValidation,
} from "../validation/index.js";
import pkg from "bcryptjs";
const { hash, compare } = pkg;
import jwt from "jsonwebtoken";

export const LoginUser = async (req, res) => {
  console.log("/LoginUser");

  const data = req.body;
  const { email, password } = data;
  const { error } = LoginschemaValidation.validate({ email, password });

  if (error)
    return res.json({
      success: false,
      message: error.details[0].message.replace(/['"]+/g, ""),
    });

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({ success: false, message: "Account not Found" });

    const isMatch = await compare(password, checkUser.password);
    if (!isMatch)
      return res.json({ success: false, message: "Incorrect Password" });

    const token = jwt.sign(
      { id: checkUser._id, email: checkUser.email },
      process.env.JWT_SECREAT ?? "default_secret_dumbScret",
      { expiresIn: "1d" }
    );

    const finalData = {
      token,
      user: {
        name: checkUser.name,
        email: checkUser.email,
        phone: checkUser.phone,
        _id: checkUser._id,
        online: checkUser.online,
      },
    };
    return res.json({ success: true, message: "Login Successfull", finalData });
  } catch (error) {
    console.log("🚀 ~ file: index.js:28 ~ LoginUser ~ error:", error);
    return res.json({
      success: false,
      message: "Something Went Wrong Please Retry Later !",
    });
  }
};

export const RegisterUser = async (req, res) => {
  console.log("/RegisterUser");

  const { name, email, password, confirmPassword } = req.body;

  // Validate input using Joi or your chosen validation library
  const { error } = registerSchemaValidation.validate({
    name,
    email,
    password,
  });

  if (error) {
    // Return validation error with HTTP status code 400 (Bad Request)
    return res.status(400).json({
      success: false,
      message: error.details[0].message.replace(/['"]+/g, ""),
    });
  }

  try {
    // Check if the user already exists
    const ifExist = await User.findOne({ email });

    if (ifExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the user's password
    const hashedPassword = await hash(password, 12);

    // Create a new user
    const createUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    if (createUser) {
      console.log("User created:", createUser);

      // Return success response
      return res.status(201).json({
        success: true,
        message: "Account created successfully",
      });
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error("🚀 ~ RegisterUser ~ error:", error);

    // Return generic error response with status code 500 (Internal Server Error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
};
