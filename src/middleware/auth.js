
const jwt = require("jsonwebtoken")
const { createCustomError } = require("../errors/custom-error")
const asyncWrapper = require("../middleware/asyncWrapper")


const authenticate = asyncWrapper(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createCustomError("No suitable token", 401)
    }

    const token = authHeader.split(" ")[1]

    const payload = jwt.verify(token, process.env.JWT_SECRET)

    req.user = { userId: payload.userId, email: payload.email };

    next()
}
)
module.exports = authenticate

