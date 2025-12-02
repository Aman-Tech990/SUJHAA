import dotenv from "dotenv";
dotenv.config({}); // 🔥 make sure env vars exist in this file

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // TLS for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Optional: debug one time
console.log("SMTP CONFIG ->", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER 
});

export async function sendOtpEmail({ to, name, digitalId, otp }) {
    const mailOptions = {
        from: `"SUJHAA Support" <${process.env.SMTP_SENDER}>`,
        to,
        subject: "Your SUJHAA Registration OTP & Digital ID",
        html: `
            <p>Dear ${name},</p>
            <p>Thank you for registering on <b>SUJHAA</b>.</p>
            <p>Your <b>Digital ID</b> is: <b>${digitalId}</b></p>
            <p>Your <b>OTP</b> for verification is: <b>${otp}</b></p>
            <p>This OTP is valid for 10 minutes.</p>
            <p>Regards,<br/>SUJHAA Team</p>
        `
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 OTP email sent to", to);
}
