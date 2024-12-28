
const Task = require("../models/Task")

const createCustomError = require("../errors/custom-error")


const verifyTaskOwner = async (taskID, userID) => {

    const task = await Task.findById(taskID)

    if (!task) {
        throw createCustomError("Task not found", 404)
    }

    if (task.createdBy.toString() !== userID) {
        throw createCustomError("Unauthorized", 403)
    }

    return task;
}

module.exports = { verifyTaskOwner }