
const User = require("../models/User")
const { createCustomError } = require("../errors/custom-error")
const asyncWrapper = require("../middleware/asyncWrapper")



const createUser = async (req, res, next) => {

    const { email, password, username } = req.body

    if (!email && !password) {
        throw createCustomError("Email and Password must be provided", 404)
    }


}


