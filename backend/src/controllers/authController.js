import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import generateTokens from "../utils/generateToken.js"

// Register
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((field) => !field || field?.trim() === "")) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password,
    });

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }

    // res
    // .status(201).json({
    //   _id: user._id,
    //   email: user.email,
    //   token: generateToken(user._id),
    // });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        _id: user._id,
        email: user.email,
        message: "User registered successfully",
      })


  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if ([email, password].some((field) => !field || field?.trim() === "")) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    const user = await User.findOne({ email }).select("-password -refreshToken");

    // if (
    //   user &&
    //   (await bcrypt.compare(password, user.password))
    // ) {
    //   return res.json({
    //     _id: user._id,
    //     email: user.email,
    //     token: generateToken(user._id),
    //   });
    // }

    if (!user) {
      return res
        .status(401)
        .json({
          message: "User does not exist",
        })
    }

    const isPasswordValid = await User.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({
          message: "Invalid password",
        })
    }

    const {accessToken,refreshToken} = await generateTokens(user._id)

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        _id: user._id,
        email: user.email,
        message: "User logged in successfully",
      })

    // res.status(401).json({
    //   message: "Invalid email or password",
    // });

  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset:{
          refreshToken: 1
        }
      },
      {
        new: true
      }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
      {
        success: true,
        message: "User logged Out successfully"
      }
    )

  } catch (error) {
    conasole.log(error)

     res.status(500).json({
      message: error.message,
    });
  }
}

export {
  registerUser,
  loginUser,
  logoutUser
}