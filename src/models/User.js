
const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")


const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        set: (value) => value.toLowerCase()

    },
    password: {
        type: String
    },
    refreshTokens: [{
        type: String
    }]
})

UserSchema.pre("save", async function (next) {

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

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)

}

UserSchema.methods.addRefreshToken = async function (token) {
    this.refreshTokens.push(token);
    await this.save()
}

UserSchema.methods.removeRefreshToken = async function (token) {
    const index = this.refreshTokens.indexOf(token)
    if (index !== -1) {
        this.refreshTokens.splice(index, 1)
        await this.save()
    }
}

module.exports = mongoose.model("User", UserSchema)