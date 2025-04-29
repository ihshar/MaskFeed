import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    await dbConnect();

    try {
        // const reqBody = request.body;
        // const {username,email,password}:any = reqBody;

        const {username,email,password} =  await request.json();

        // check if user exists in db
        const existingUserVerifiedByUsername  = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success:false,
                message:"Verified user already taken"
            },{status:400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success:false,
                    message:"User already exists with this email"
                },{status:400})
            }
            else{
                const hashPassword = await bcrypt.hash(password,10);

                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save(); 
            }
        }
        else{
            //create hashPassword

            const hashPassword = await bcrypt.hash(password,10);

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1);

            //create a new user
            const newUser = new UserModel({
                username:username,
                email:email,
                password:hashPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })

            //save the newly created user 
            await newUser.save();

        }

        //Send verification email

        const emailResponse = await sendVerificationEmail(email,username,verifyCode);

        if(!emailResponse.success){
           return NextResponse.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }

        return NextResponse.json({
            success:true,
            message:"User registered successfully,Please verify your email",
            email
        },{status:201   })
    } catch (error) {
        console.error("Error while registering user");
        return NextResponse.json({
            success:true,
            message:"Error while registering user"
        },{status:500})
    }
}
