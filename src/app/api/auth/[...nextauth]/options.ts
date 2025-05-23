import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user.model"
UserModel


export const authOptions:NextAuthOptions = {
    providers:[ 
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            //authorization function -> will go to the Provider of this function
            async authorize(credentials:any):Promise<any>{
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error(`No user found with this ${credentials.identifier.email} or ${credentials.identifier.username}`);
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account before logging in")
                    }

                    //Made validation check here for password 
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);

                    if(!isPasswordCorrect){
                        throw new Error("Please check your password")
                    }else{
                        return user;
                    }

                } catch (err:any) {
                    throw new Error(err);
                }
            }
        })
    ],

    pages:{
        signIn:'/sign-in'
    },

    callbacks:{
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            
            return session;
        }
    },

    session:{
        strategy:"jwt"
    },

    secret:process.env.NEXT_AUTH_SECRET,
}


