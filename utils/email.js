// config nodemailer

// imports
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// send email
exports.sendEmail = async (email, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject,
      text,
    });
    return info;
  } catch (err) {
    throw new Error(err.message);
  }
};

// send verification email
exports.sendVerificationEmail = async (email, token) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Verify your email",
      text: `Your verification token is ${token}`,
    });
    return info;
  } catch (err) {
    throw new Error(err.message);
  }
};

// send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      // to: "vukovic.pavle@icloud.com",
      subject: "Reset your password",
      text: `Your password reset token is ${token}`,
    });
    return info;
  } catch (err) {
    throw new Error(err.message);
  }
};
