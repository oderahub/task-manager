
const z = require("zod")



const taskSchema = z.object({
    title: z.string().trim().min(1, { message: "Title must be provided" }),
    description: z.string().trim().min(1, { message: "Task must be provided" }).max(80, { message: "character must not be more than 80" }),
    dueDate: z.date()
        .refine((date) => {
            // validating that dueDate should be in the future, consider timezone issues
            const now = new Date(date)
            now.setHours(0, 0, 0, 0)
            return new Date(date) > new Date(), {
                message:
                    "Due date must be in future date",
            }
        })
        .optional(),
    status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
    priority: z.enum(["low", "medium", "high"]).default("low"),
    assignedTo: z.string().email({ message: "AssignedTo must be a valid email" }).optional(),
    tags: z.array(z.string()).optional().transform((val) => (val ? val.split(",") : [])),
    createdBy: z.string().uuid().optional(), // Assuming createdBy is a UUID
    completed: z.boolean().default(false)

})

const taskUpdateSchema = taskSchema.partial();

const shareTaskSchema = z.object({
    taskID: z.string().min(1, { message: "Task ID is required" }),
    email: z.string().email({ message: "Email must be valid" })
});

module.exports = { taskSchema, taskUpdateSchema, shareTaskSchema };