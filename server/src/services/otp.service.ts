import nodemailer from "nodemailer"

import { EMAIL_SERVICE } from "@/config/AppConstant"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_SERVICE.email_user,
        pass: EMAIL_SERVICE.email_pass,
    },
})

export const sendOtpEmail = async (
    to: string,
    otp: string
): Promise<boolean> => {
    const mailOptions = {
        from: `"Ultimate Resume" <${EMAIL_SERVICE.email_user}>`,
        to,
        subject: "Your OTP Verification Code",
        html: `
            <h2>Verify Your Email</h2>
            <p>Your OTP is: <strong>${Number(otp)}</strong></p>
            <p>This code will expire in 9 minutes.</p>
        `,
    }

    try {
        await transporter.sendMail(mailOptions)
        return true
    } catch (error) {
        console.error("❌ Failed to send OTP email:", error)
        return false
    }
}
