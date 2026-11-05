import mongoose from 'mongoose'
import { ALLENVS } from './env.config.js';

const connectDB = async () => {

    try {
        const connection = await mongoose.connect(ALLENVS.mongoURI);
        console.log("database is connected!")
    }
    catch (error) {
        console.log("database is NOT connected!", error)
    }
    
}

export default connectDB