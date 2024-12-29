
const User = require("../models/User")
const { createCustomError } = require("../errors/custom-error")
const asyncWrapper = require("../middleware/asyncWrapper")
const jwt = require("jsonwebtoken")



const registerUser = asyncWrapper(async (req, res) => {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
        throw createCustomError("User must provide email, password and username", 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw createCustomError("Invalid email format", 400)
    }

    if (password.length < 8) {
        throw createCustomError("Password must be 8 characters long", 400)
    }

    const existingEmail = await User.findOne({ email })

    if (existingEmail) {
        throw createCustomError("User email exist, login", 409)
    }
    const newUser = new User({ email, password, username })
    await newUser.save()
    res.status(201).json({
        message: "User registered", user: newUser,
        user: { id: newUser._id, email: newUser.email, username: newUser.username }
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

    const accessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" })

    const refreshToken = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    await user.addRefreshToken(refreshToken)

    res.status(200).json({ message: "login successful", accessToken })

}
)

const refreshToken = asyncWrapper(async (req, res) => {
    const refreshToken = req.body.refreshToken

    if (!refreshToken) {
        throw createCustomError("Token is required", 400)
    }

    let decoded;

    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
        throw createCustomError("invalid token", 401)
    }

    const user = await User.findOne({ _id: decoded.user.userId, refreshTokens: { $in: [refreshToken] } })

    if (!user) {
        throw createCustomError("Token not found in users token", 401)

    }

    const newAccessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" })
    res.status(200).json({ accessToken: newAccessToken })
})


module.exports = { registerUser, loginUser, refreshToken }