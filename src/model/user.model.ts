import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:String;
    createdAt:Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})


export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"User is Required"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Please provide a valid email']
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
        unique:true,
    },
    verifyCode:{
        type:String,
        required:[true,"VerifyCode is Required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"VerifyCodeExpiry is Required"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    }, 
    isAcceptingMessage:{
        type:Boolean,
        required:[true,"isAcceptingMessage is Required"],
        default:true,
    },
    messages: [MessageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("users",UserSchema);

export default UserModel;