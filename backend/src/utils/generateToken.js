import User from "../models/User.model.js";

const generateTokens = async (id) => {
  // return jwt.sign(
  //   { id },
  //   process.env.ACCESS_TOKEN_SECRET,
  //   { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  // );

  try {
    const user = User.findById(id);
    const accessToken = User.generateAccessToken();
    const refreshToken = User.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken}

  } catch (error) {
     console.log("Error :", error)
  }
};

export default generateTokens;