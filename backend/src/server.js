import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { ENV } from "./env.js";
import { app, server } from "./lib/socket.js";

// const app = express()

app.use(express.json({limit: "5mb"}))
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}))
app.use(cookieParser())

import authRouter from "./routes/auth.routes.js"
app.use("/api/auth", authRouter)

import messageRouter from "./routes/message.routes.js"
app.use("/api/message", messageRouter)


import path from "path";
const __dirname = path.resolve()
if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("/", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}
        
const PORT = ENV.PORT || 5000

server.listen(PORT, () => {
    console.log("App is listening at Port", PORT)
    connectDB()
})
