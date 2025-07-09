import mongoose from "mongoose";

type ConnectionObj = {
    isConnected?: number
}

const conn : ConnectionObj = {}

async function dbConnect(): Promise<void> {
    if(conn.isConnected) {
        return;
    }
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI || "");
        conn.isConnected = con.connections[0].readyState;

    }
    catch (error) {
        console.error(error)
    }
}
export default dbConnect