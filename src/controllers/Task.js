
const Task = require("../models/Task")
const asyncWrapper = require("../middleware/asyncWrapper")
const { createCustomError } = require("../errors/custom-error")
const User = require("../models/User")


const getAllTask = asyncWrapper(async (req, res, next) => {
    const tasks = await Task.find({})
    if (tasks.length === 0) {

        throw createCustomError("No task found", 404)

    }
    res.status(200).json({ tasks })
})


const getOneTask = asyncWrapper(async (req, res, next) => {

    const { id: taskID } = req.params
    const task = await Task.findById(taskID)
    if (!task) {
        throw createCustomError(`Task not found with ID ${taskID}`, 404)

    }

    res.status(200).json({ task })
}
)
const createTask = asyncWrapper(async (req, res) => {
    const { title, description, dueDate, status, priority, assignedTo, tags, completed } = req.body
    if (!title || !description) {

        throw createCustomError("Task title and description is required", 400)

    }
    if (!req.user || !req.user.userId) {
        throw createCustomError("User not authenticated", 401)
    }
    const task = new Task({ title, description, dueDate, status, priority, createdBy: req.user.userId, assignedTo, tags, completed: completed || false })
    await task.save()
    res.status(201).json({ task: task })

}
)


// const createTask = asyncWrapper(async (req, res) => {
//     const task = new Task({
//         ...req.body,
//         createBy: req.User,
//         createdAt: req.body.createdAt,
//         completed: req.body.completed || false
//     });
//     await task.save()
//     res.status(201).json({ task })
// }

// )

const updateTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params
    const updateFileds = { ...req.body }

    if (Object.keys(updateFileds).length === 0) {
        throw createCustomError("Provide at least one field to update", 400)

    }

    const updatedTask = await Task.findByIdAndUpdate(taskID, { updateFileds }, { new: true, runValidators: true })
    if (!updatedTask) {
        throw createCustomError(`Error updating task ${taskID}`, 404)

    }

    res.status(200).json({ task: updatedTask })
}
)
const deleteTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params
    const deletedTask = await Task.findByIdAndDelete(taskID)
    if (!deletedTask) {
        throw createCustomError(`Error deleting task ${taskID}`, 404)

    }
    res.status(200).json({ message: "Task deleted successfully", task: deletedTask })

}
)
module.exports = { deleteTask, createTask, getOneTask, getAllTask, updateTask }