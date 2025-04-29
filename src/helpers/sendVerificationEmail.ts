import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// interface sendVerificationEmail{
//     email:string
//     username:string
//     password:number;
// }

// export const sendVerificationEmail = async({email,username,password}:any) => {
// }

export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'MaskFeed | Verification Email',
            react: VerificationEmail({ username,otp:verifyCode }),
        });

        return {
            success:true,
            message:"Verification email send successfully"
        }
        
    } catch (emailError) {
        console.log("Error while sending verification email",emailError);
        return {
            success:false,
            message:"Failed to send verification email"
        }
    }
}
