
import { User } from "../../../Database";
import { Hash } from "../encryption";
import { sendEmail } from "./email";
import { emailHtml } from "./emailHtml";
import { generateOTP } from "../otp";






// Separate event listener (should be declared once in your setup)
export const generateAndSendOTP = async (email:string, firstName:string, lastName:string) => {
    let otp = String(generateOTP());
    const hash = await Hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS });
  
    // Ensure expiredDateOtp is always set
    const expiredDateOtp = new Date(Date.now() +5 *60 * 1000);
    await User.updateOne({ email }, { otpEmail: hash, expiredDateOtp });
  
    // Send email after updating the database
    await sendEmail({
      to: email,
      subject: "Please Verify",
      html: emailHtml(otp, `${firstName} ${lastName}`),
    });
  };


//second OTP to Confirm email 
export const generateAndSecondSendOTP = async (email:string, firstName:string, lastName:string) => {
    let otp = String(generateOTP());
    const hash = await Hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS });
  
    // Ensure expiredDateOtp is always set
    const expiredDateOtp = new Date(Date.now() + 5 *60 * 1000);
    await User.updateOne({ email }, { otpEmail: hash, expiredDateOtp });
  
    // Send email after updating the database
    await sendEmail({
      to: email,
      subject: "Please Resend Verify",
      html: emailHtml(otp, `${firstName} ${lastName}`),
    });
  };
  

//forget password


export const sendOTPForgetPassword = async (email:string, firstName:string, lastName:string ,otpEmail:string) => {
 
  // Send email after updating the database
  await sendEmail({
    to: email,
    subject: "Forget Password",
    html: emailHtml(otpEmail, `${firstName} ${lastName}`),
  });
};



//resend forget password
export const secondOTPForgetPassword = async (email:string, firstName:string, lastName:string ,otpEmail:string) => {
 
    // Send email after updating the database
    await sendEmail({
      to: email,
      subject: "Resend Forget Password",
      html: emailHtml(otpEmail, `${firstName} ${lastName}`),
    });
  };
  

  //contact us
  export const contactUsEmail = async(email:string, firstName:string, lastName:string ,phone:string ,message:string)=>{
    const emailHtml =`
    <h2>New Contact Message Received</h2>
       <p><strong>From:</strong> ${firstName} ${lastName}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone || "No phone provided"}</p>
       <p><strong>Message:</strong></p>
       <p>${message}</p>
 `
    await sendEmail({
      to:process.env.USER_SENDER!,
      
      subject:`New Contact Message from ${email} `,
      html :emailHtml,
    })
    
  }