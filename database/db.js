
const mongoose = require("mongoose")


const dotenv = require("dotenv")

dotenv.config();

const connectionString = process.env.MongoDb_URI

const connectToDb = async () => {

    if (!connectionString) {
        console.error("Mongodb Database url not in env.")
        return;

    }

    try {
        await mongoose.connect(connectionString)
        console.log("Database connected sucssefully...")
    } catch (error) {

        console.error("Error connecting to Database", error.message);
    }
}

module.exports = connectToDb