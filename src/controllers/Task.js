
const Task = require("../models/Task")
const asyncWrapper = require("../middleware/asyncWrapper")
const { createCustomError } = require("../errors/custom-error")


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
    const { name, completed } = req.body
    if (!name) {

        throw createCustomError("Task name is required", 400)

    }
    const newTask = new Task({ name, completed: completed || false })
    await newTask.save()
    res.status(201).json({ task: newTask })

}
)

const updateTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params
    const { name, completed } = req.body

    if (!name && completed === undefined) {
        throw createCustomError("Provide at least one field to update", 400)

    }

    const updatedTask = await Task.findByIdAndUpdate(taskID, { name, completed }, { new: true, runValidators: true })
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