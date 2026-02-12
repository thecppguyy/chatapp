import cloudinary from "../lib/cloudinary.js"
import Message from "../models/message.model.js"
import { User } from "../models/user.model.js"

export const getAllContacts = async(req, res) => {
    try {
        const currentUserId = req.user._id 
        const contacts = await User.find({_id: { $ne: currentUserId }}).select("-password")
        res.status(200).json(contacts)
    } catch (error) {
        console.log("Error in getAllContects route:", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const getChatPartners = async(req, res) => {
    try {
        const currentUserId = req.user._id
        const messages = await Message.find({
            $or: [{senderId: currentUserId}, {receiverId: currentUserId}]
        })
        const chatPartnerIds = [ ...new Set(
            messages.map((msg) => msg.senderId.toString() === currentUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString())
        )]
        const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password")
        res.status(200).json(chatPartners)
    } catch (error) {
        console.log("Error in getChatPartners route:", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const getMessages = async(req, res) => {
    try {
        const myId = req.user._id
        const { id: userId } = req.params
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userId },
                { receiverId: myId, senderId: userId }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages route:", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const sendMessage = async(req, res) => {
    try {
        const { text, image } = req.body
        if(!text && !image) return res.status(400).json({message: "Atleast one field is required!"})

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            if(!uploadResponse) return res.status(502).json({message: "Bad Gateway!"})
            imageUrl = uploadResponse.secure_url
        }

        const senderId = req.user._id
        const { id: receiverId } = req.params

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        // Socket.io integration

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage route:", error)
        res.status(500).json({message: "Internal server error"})
    }
}
