import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "markanddighe3@gmail.com",
    pass: "ubgkmxlfrovktztm",
  },
});

export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "markanddighe3@gmail.com",
    to: email,
    subject: "For Verification Email",
    text: `Your OTP for email verification is: ${otp}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #ffffff;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777777;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Email Verification</h2>
        </div>
        <p>Dear User,</p>
        <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for the next 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};




export const sendForgetPassword = async (email, otp) => {
    const mailOptions = {
      from: "markanddighe3@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Your OTP for Forget Password is: ${otp}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #333333;
          }
          .content {
            text-align: center;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #4CAF50;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            margin-top: 30px;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password.</p>
            <p>Your One-Time Password (OTP) is:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for the next 10 minutes.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };
