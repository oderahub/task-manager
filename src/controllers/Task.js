const { taskSchema, taskUpdateSchema, shareTaskSchema } = require('../utiles/taskSchema');
const Task = require("../models/Task")
const asyncWrapper = require("../middleware/asyncWrapper")
const { createCustomError } = require("../errors/custom-error")
const verifyTaskOwner = require("../utiles/verifyOwner")

const getAllTask = asyncWrapper(async (req, res) => {
    const validatedQuery = taskSchema.partial().safeParse(req.query);
    if (!validatedQuery.success) {
        const errors = validatedQuery.error.errors.map(e => e.message).join(', ');
        throw createCustomError(errors, 400);
    }

    const { page = 1, limit = 20, ...filterOptions } = validatedQuery.data;
    const queryObject = { ...filterOptions, createdBy: req.user.userId };




    let sortObject = { createdAt: -1 };
    if (req.query.sort && ['title', 'dueDate', 'priority'].includes(req.query.sort)) {
        const order = req.query.order === 'desc' ? -1 : 1;
        sortObject = { [req.query.sort]: order };
    }


    // Use sortObject in your query
    const tasks = await Task.find(queryObject)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort(sortObject);


    const totalTasks = await Task.countDocuments(queryObject);
    const totalPages = Math.ceil(totalTasks / limit);
    res.status(200).json({
        totalTasks,
        totalPages,
        currentPage: parseInt(page),
        tasks
    });
});

const getOneTask = asyncWrapper(async (req, res) => {

    const { id: taskID } = req.params
    const userId = req.user.userId

    if (!taskID) {
        throw createCustomError("Task ID is required", 400);
    }

    const task = await verifyTaskOwner(taskID, userId)


    res.status(200).json({ task })

}

)

const createTask = asyncWrapper(async (req, res) => {
    const validatedData = taskSchema.omit({ createdBy: true }).safeParse(req.body);
    if (!validatedData.success) {
        const errors = validatedData.error.errors.map(e => e.message).join(', ');
        throw createCustomError(errors, 400);
    }

    if (!req.user || !req.user.userId) {
        throw createCustomError("User not authenticated", 401);
    }

    const task = new Task({ ...validatedData.data, createdBy: req.user.userId });
    await task.save();
    res.status(201).json({ task });
});

const updateTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params;
    const validatedData = taskUpdateSchema.safeParse(req.body);
    if (!validatedData.success) {
        const errors = validatedData.error.errors.map(e => e.message).join(', ');
        throw createCustomError(errors, 400);
    }

    if (!taskID) {
        throw createCustomError("Task ID is required", 400);
    }

    const userID = req.user.userId;
    await verifyTaskOwner(taskID, userID);

    const updatedTask = await Task.findByIdAndUpdate(taskID, validatedData.data, { new: true, runValidators: true });
    if (!updatedTask) {
        throw createCustomError(`Error updating task ${taskID}`, 404);
    }

    res.status(200).json({ task: updatedTask });
});

const deleteTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params;
    const userID = req.user.userId;

    if (!taskID) {
        throw createCustomError("Task ID is required", 400);
    }

    await verifyTaskOwner(taskID, userID);

    const deletedTask = await Task.findByIdAndDelete(taskID);
    if (!deletedTask) {
        throw createCustomError(`Error deleting task ${taskID}`, 404);
    }
    res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
});

const shareTask = asyncWrapper(async (req, res) => {
    const validatedData = shareTaskSchema.safeParse(req.body);
    if (!validatedData.success) {
        const errors = validatedData.error.errors.map(e => e.message).join(', ');
        throw createCustomError(errors, 400);
    }

    const { taskID, email } = validatedData.data;
    const userID = req.user.userId;
    await verifyTaskOwner(taskID, userID);

    const task = await Task.findById(taskID);
    if (!task) {
        throw createCustomError("Task not found", 404);
    }

    // Placeholder for email logic
    console.log(`Sending email to ${email} with message: Task "${task.title}" has been shared with you.`);

    res.status(200).json({ message: `Task shared with ${email}` });
});

module.exports = { deleteTask, createTask, getOneTask, getAllTask, updateTask, shareTask };