import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:Number
}

const connection:ConnectionObject = {}

async function dbConnect():Promise<void>{

    if(connection.isConnected){
        console.log("DB connection already exists")
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfully");
    } catch (error:any) {
        console.log("DB connection Failed");
        process.exit(1);
    }
}

export default dbConnect;