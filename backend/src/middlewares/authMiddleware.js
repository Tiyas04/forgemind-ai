import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// const protect = async (req, res, next) => {

//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {

//     try {

//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET
//       );

//       req.user = await User.findById(decoded.id).select("-password");

//       next();

//     } catch (error) {
//       return res.status(401).json({
//         message: "Not authorized",
//       });
//     }

//   }

//   if (!token) {
//     return res.status(401).json({
//       message: "No token",
//     });
//   }
// };

// export default protect;

const verifyJWT = async (req,res,next) => {
  try {
    const token = req.cookies?.accessToken

    if(!token){
      return res
      .status(401)
      .json({
        message: "Unauthorized request"
      })
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decoded?._id).select("-password -refreshToken");

    if (!user) {
      return res
      .status(404)
      .json({
        message: "User not found"
      })
    }

    req.user = user
    next()
    
  } catch (error) {
    console.log(error)
  }
}

export {verifyJWT}