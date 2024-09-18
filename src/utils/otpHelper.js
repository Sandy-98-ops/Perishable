import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';

// Generate OTP
export const generateOTP = () => {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
};

// Send OTP via email
export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'patilsandesh2311@gmail.com',
            pass: 'bfuyxzhecwndqbmc'
        }
    });

    const mailOptions = {
        from: 'patilsandesh2311@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    return transporter.sendMail(mailOptions);
};