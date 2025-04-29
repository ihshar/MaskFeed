import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { compare } from "bcryptjs";
import { NextRequest } from "next/server";


export  async function POST(request:NextRequest){
    await dbConnect();

    try {
        const {username,code} = await request.json();
        
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User Not Found"
                },
                {
                    status:404
                }
            )
        }

        //Username exist
        if(user.isVerified === true){
            return Response.json(
                {
                    success:false,
                    message:"User Already Verified"
                },
                {
                    status:401
                }
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success:true,
                    message:"User Verified Successfully"
                },
                {
                    status:200
                }
            )
        } 
        else if(!isCodeNotExpired){
            return Response.json(
                {
                    success:false,
                    message:"Verification Code is Expired.Please SignUp Again to get a new one."
                },
                {
                    status:400
                }
            )
        }
        else{
            return Response.json(
                {
                    success:false,
                    message:"Verification Code is Invalid."
                },
                {
                    status:400
                }
            )
        }


    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"Error Verifying User"
            },
            {
                status:500
            }
        )
    }
}