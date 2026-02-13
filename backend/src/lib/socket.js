import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "../env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    }
})

io.use(socketAuthMiddleware)

// Function to check if the user is online or not
export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}


// This is for storing online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName)

    const userId = socket.userId;
    // adding the online user to userSocketMap object
    userSocketMap[userId] = socket.id;
    console.log("User socket map:", userSocketMap)
    // sending this event i.e. one new user is online to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    // listening events from client
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { io, app, server }
