import mongoose from "mongoose"
import { ENV } from "../env.js"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${ENV.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log("MONGODB CONNECTED :", conn.connection.host) 
    }
    catch(error) {
        console.error("MongoDB connection error :", error)
        process.exit(1)
    }
}

