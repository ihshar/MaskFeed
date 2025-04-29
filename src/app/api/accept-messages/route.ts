import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";


export async function POST(request:NextRequest){
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user:User = session?.user 

    
    if(!session || !user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {
                status:401
            }
        )
    }
    
    const userID = user._id;
    const {AcceptMessages} = await request.json()

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userID,
            {isAcceptingMessage:AcceptMessages},
            {new:true}
        )

        if(!updateUser){
            return Response.json(
                {
                    success:false,
                    message:"Failed to update user status of accepting messages"
                },
                {
                    status:401
                }
            )
        }

        return Response.json(
            {
                success:true,
                message:"Message acceptance status updated successfully",
                updateUser
            },
            {
                status:200
            }
        )

    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"Failed to update user status to accept messages"
            },
            {
                status:500
            }
        )
    }


}

export async function GET(request:NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user:User = session?.user

    if(!session || !user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {
                status:401
            }
        )
    }

    const userId = user._id;

    const foundUser = await UserModel.findById(userId);

    try {
        if(!foundUser){
            return Response.json(
                {
                    success:false,
                    message:"User not Found"
                },
                {
                    status:404
                }
            )
        }
    
        return Response.json(
            {
                success:true,
                messages:"Message acceptance status retrieved successfully",
                isAcceptingMessage:foundUser.isAcceptingMessage
            },
            {
                status:200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"Error in getting message acceptance status"
            },
            {
                status:500
            }
        )
    }


}