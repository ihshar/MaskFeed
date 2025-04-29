import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user.model";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
    await dbConnect();

    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status:404
                }
            )
        }

        if(user.isAcceptingMessage === false){
            return Response.json(
                {
                    success:false,
                    message:"User is not accepting messages"
                },
                {
                    status:403
                }
            )
        }

        // await UserModel.findOneAndUpdate({username},{
        //     messages:{
        //         $set:{
        //             content,
        //             createdAt:new Date()
        //         }
        //     }
        // })

        // await user.save()

        const newMessage = {content,createdAt:new Date()}

        user.messages.push(newMessage as Message)

        return Response.json(
            {
                success:true,
                message:"Message send successfully"
            },
            {
                status:200
            }
        )
        
    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"Error while Sending Messages"
            },
            {
                status:500
            }
        )
    }
}