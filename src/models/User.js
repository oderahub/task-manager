
const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")


const UserShema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    username: {
        type: String,

    },
    password: {
        type: String
    }
})

module.exports = mongoose.model("User", UserShema)