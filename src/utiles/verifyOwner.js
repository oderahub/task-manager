
const Task = require("../models/Task")

const createCustomError = require("../errors/custom-error")


const verifyTaskOwner = async (taskID, userID) => {


    if (!taskID || !/^[0-9a-fA-F]{24}$/.test(taskID)) {
        throw createCustomError("Invalid task ID", 400)
    }

    const task = await Task.findById(taskID)



    if (task.createdBy !== userID) {
        throw createCustomError("Unauthorized", 403)
    }

    return task;
}

module.exports = { verifyTaskOwner }