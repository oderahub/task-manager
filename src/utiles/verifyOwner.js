
const Task = require("../models/Task")

const createCustomError = require("../errors/custom-error")


const verifyTaskOwner = async (taskID, userID) => {


    if (!taskID || !Types.ObjectId.isValid(taskID)) {
        throw createCustomError("Invalid task ID", 400)
    }

    const task = await Task.findById(taskID)



    if (task.createdBy.toString() !== userID) {
        throw createCustomError("Unauthorized", 403)
    }

    return task;
}

module.exports = { verifyTaskOwner }