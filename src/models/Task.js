const mongoose = require("mongoose")
const User = require("./User")



const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title must be provided"],
    },
    description: {
        type: String,
        required: [true, "Task must be provided"],
        trim: true,
        maxlength: [80, "character must not be more than 80"]
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "in-progress", "completed"]
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    },
    createdBy: {
        type: String,
        ref: User,
        required: true
    },
    assignedTo: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email validation regex
            },
            message: (props) => `${props.value} is not a valid email!`,
        },

    },
    tags: {
        type: [String]
    },
    completed: {
        default: false,
        type: Boolean,
    },
},
    {
        timestamps: true
    }
)

TaskSchema.index({ dueDate: 1 })
TaskSchema.index({ priority: 1 })
TaskSchema.index({ status: 1 })
TaskSchema.index({ createdBy: 1 })
TaskSchema.index({ tags: "text" })
module.exports = mongoose.model("Task", TaskSchema)