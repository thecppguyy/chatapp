import jwt from "jsonwebtoken"
import { ENV } from "../env.js"
import { User } from "../models/user.model.js"

export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token) return res.status(401).json({message: "Unauthorized - Missing token!"})

        const verifiedToken = jwt.verify(token, ENV.JWT_SECRET)
        if(!verifiedToken) return res.status(401).json({message: "Unauthorized request!"})

        const user = await User.findById(verifiedToken.userId).select("-password")
        if(!user) return res.status(400).json({message: "User not found!"})

        req.user = user

        next() 
    } catch (error) {
        console.log("Couldn't verify the token: ", error)
        res.status(500).json({message: "Internal server error!"})
    }
}
