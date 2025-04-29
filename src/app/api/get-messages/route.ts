import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:NextRequest){
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

    const userId = new mongoose.Types.ObjectId(user._id)

    try {

        const user = await UserModel.aggregate([
            {$match: {_id:userId}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$_id",messages:{$push:"$messages"}}}
        ])

        if(!user || user.length === 0){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status:401
                }
            )
        }

        return Response.json(
            {
                success:true,
                message:user[0].messages
            },
            {
                status:200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"Error in Retrieving Messages"
            },
            {
                status:500
            }
        )
    }
}