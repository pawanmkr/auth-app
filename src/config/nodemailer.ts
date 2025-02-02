import nodemailer from 'nodemailer';

import { envSchema } from './env';
import { appLogger } from './logger';

// Create a nodemailer transporter object with the email configuration
const transporter = nodemailer.createTransport({
    host: envSchema.EMAIL_HOST,
    port: envSchema.EMAIL_PORT,
    secure: true,
    auth: {
        user: envSchema.EMAIL_USER,
        pass: envSchema.EMAIL_PASS,
    },
});

export async function sendMail(
    recipient: string,
    subject: string,
    message: string
) {
    const mailOptions = {
        from: envSchema.EMAIL_USER,
        to: recipient,
        subject: subject,
        text: message,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        appLogger.error(`Error sending email: ${error}`);
    }
}

export async function sendTestEmail() {
    await sendMail(
        'iampawanmkr@gmail.com',
        'Test Email',
        'This is a test email'
    );
    console.log('✉️ Test email sent successfully');
    appLogger.info('Test email sent successfully');
}
