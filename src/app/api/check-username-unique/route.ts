import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";



const usernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:NextRequest){
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url)

        const queryParams = {
            username:searchParams.get('username') 
        }

        // validate with zod 
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log(result) //TODO :remove

        
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json(
                {
                success:false,
                message:usernameErrors?.length>0?usernameErrors.join(' ')
                :"Invalid Query Parameters"
                },
                {
                    status:400
                }
            )
        }

        const {username} = result.data

        
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVerifiedUser){
            return Response.json(
                {
                    success:false,
                    message:"Username is taken"
                },
                {
                    status:400
                }
            )
        }

        return Response.json(
            {
                success:true,
                message:"Username is unique"
            },
            {
                status:200
            }
        )

    } catch (error) {
        console.error("Error checking username",error)
        return Response.json(
            {
            success:false,
            message:"Error Checking Username"
            },
            {
                status:500
            }
    )
    }
}