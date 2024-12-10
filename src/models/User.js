
const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")


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
        set: (value) => value.toLowerCase()

    },
    password: {
        type: String
    }
})

UserShema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next()
    }

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    } catch (error) {
        next(error)
    }
})

UserShema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)

}

module.exports = mongoose.model("User", UserShema)