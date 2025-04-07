import redisClient from "@/config/redisClient"
import { generateOTP } from "@/utils/otp"
import nodemailer from "nodemailer"

export const sendOtpToEmail = async (email: string) => {
    const otp = generateOTP()

    // Store in Redis for 3 minutes
    await redisClient.set(`otp_${email}`, otp, { EX: 180 })

    // Send OTP to email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER, // use .env
            pass: process.env.MAIL_PASSWORD, // use .env
        },
    })

    await transporter.sendMail({
        from: `"Resume Builder" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
    })

    return otp
}
