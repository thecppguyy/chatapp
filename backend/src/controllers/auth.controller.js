import { User } from "../models/user.model.js"
import bcrypt from "bcrypt"
import { generateToken } from "../lib/utils.js"
import { sendWelcomeEmail } from "../email/emailHandler.js"
import { ENV } from "../env.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required!"})
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be atleast 6 characters long!"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format!"})
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message: "User already exits!"})

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        })
        if(newUser) {
            const savedUser = await newUser.save()
            generateToken(newUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profile: newUser.profile,
            })

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL)
            } catch (error) {
                console.error("Failed to send welcome email: ", error)
            }

        } else {
            res.status(400).json({message: "Invalid user data!"})
        }
    }
    catch(error) {
        console.log("Error in signup controller: ", error)
        res.status(500).json({message: "Internal server error!"})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required!"})
        }

        const user = await User.findOne({email})    
        if(!user) return res.status(400).json({message: "Invalid credentials!"})

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials!"})

        generateToken(user._id, res)

        return res
        .status(200)
        .json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profile: user.profile
        })
        
    } catch (error) {
        console.log("Error in login:", error)
        res.status(500).json({message: "Internal server error!!"})
    }
}

export const logout = (_, res) => {
    res.cookie("jwt", "", {maxAge: 0})
    res.status(200).json({message: "User logged out successfully"})
}

export const updateProfile = async(req, res) => {
    try {
        const { profile } = req.body
        if(!profile) return res.status(400).json({message: "All fields are required!"})
        
        const uploadResponse = await cloudinary.uploader.upload(profile, {folder: "chatapp/uploads"})
        if(!uploadResponse) return res.status(502).json({message: "Bad Gateway!"})

        const userId = req.user._id
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profile: uploadResponse.secure_url },
            { new: true },
        )
        .select("-password")
        
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error while updating profile: ", error)
        res.status(500).json({message: "Internal server error!"})
    }   
}
