import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const url = process.env.MONGO_LINK;

        if( !url ) {
            console.log("Database Access Error!");
            
            process.exit();
        }

        const conn = await mongoose.connect(url)

        console.log(`Mongo db connected: ${conn.connection.host}`);
    } catch (error) {
        console.error({error})

        process.exit();
    }
}