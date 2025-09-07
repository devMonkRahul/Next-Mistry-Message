import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT!),
    secure: true,
    auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.ADMIN_PASS,
    },
});

export async function sendEmail(to: string, subject: string, text: string, html: string) {
    try {
        await transporter.sendMail({
            from: process.env.ADMIN_MAIL,
            to,
            subject,
            text,
            html,
        })
    } catch (error) {
        console.log("Error in sending email: ", error);
        throw new Error("Error in sending email")
    }
}