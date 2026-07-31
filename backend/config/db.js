import mongoose from 'mongoose'

const connectDB = async () => {

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("database is connected!")
    }
    catch (error) {
        console.log("database is NOT connected!", error)
    }
    
}

export default connectDB