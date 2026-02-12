import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const sendWelcomeEmail = async(email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to chatify!",
        html: createWelcomeEmailTemplate(name, clientURL)
    })

    if(error) {
        console.log("Error while sending welcome email:", error)
        throw new Error("Failed to send welcome error!")
    }

    console.log("Welcome email sent successfully", data)
}
