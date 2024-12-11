
const User = require("../models/User")
const { createCustomError } = require("../errors/custom-error")
const asyncWrapper = require("../middleware/asyncWrapper")
const jwt = require("jsonwebtoken")



const registerUser = asyncWrapper(async (req, res) => {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
        throw createCustomError("User must provide email, password and username", 400)
    }
    const existingEmail = await User.findOne({ email })

    if (existingEmail) {
        throw createCustomError("User email exist, login", 409)
    }
    const newUser = new User({ email, password, username })
    await newUser.save()
    res.status(201).json({
        message: "User registered", user: newUser
    })

}
)


const loginUser = asyncWrapper(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw createCustomError("Invalid email or password", 400)
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw createCustomError("Invalid email or password", 401)
    }

    const validatePassword = await user.comparePassword(password)

    if (!validatePassword) {
        throw createCustomError("Invalid email or password", 401)
    }

    const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.status(200).json({ message: "login successful", accessToken })

}
)


module.exports = { registerUser, loginUser }