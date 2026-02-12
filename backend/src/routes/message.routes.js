import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { 
    getAllContacts, 
    getChatPartners, 
    getMessages, 
    sendMessage 
} from "../controllers/message.controller.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = Router()

router.use(protectRoute)

router.get("/contacts", getAllContacts)
router.get("/chats", getChatPartners)
router.get("/:id", getMessages)
router.post("/send/:id", sendMessage)

export default router
