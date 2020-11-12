import mongoose from 'mongoose';

const dbConnect = async () => {

    try {
        const con = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("DB connected......")
    }
    catch (error) {
        console.log(error.message);
    }


}

export default dbConnect
