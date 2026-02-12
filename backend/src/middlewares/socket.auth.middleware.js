import jwt from "jsonwebtoken"
import { ENV } from "../env.js";
import { User } from "../models/user.model.js"

export const socketAuthMiddleware = async(socket, next) => {
    try {
        // extract token from http-only cookies
        const token = socket.handshake.headers.cookie
          ?.split("; ")
          .find((row) => row.startsWith("jwt="))
          ?.split("=")[1];

        if(!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized - No Token Provided"));
        }

        const decodedToken = jwt.verify(token, ENV.JWT_SECRET)

        if (!decodedToken) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid Token"));
        }

        const user = await User.findById(decodedToken.userId).select("-password")
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`Socket authenticated for user: ${user.fullName}`)
        
        next()

    } catch (error) {
        console.log("Error in socket auth middleware:", error)
        next(new Error("Unauthorized - Authentication failed!"))
    }
}
