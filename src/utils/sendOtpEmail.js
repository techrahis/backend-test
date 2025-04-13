import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: "resend", // Always "resend"
    pass: process.env.RESEND_API_KEY, // Store in .env
  },
});

export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "TechRahis.com <no-reply@updates.techrahis.com>", // must be a verified domain with Resend
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif; padding:20px;">
        <h2>Hello 👋</h2>
        <p>Your OTP code is:</p>
        <h1 style="color:#4F46E5;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <br />
        <small>If you did not request this, you can ignore this email.</small>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    return false;
  }
};
