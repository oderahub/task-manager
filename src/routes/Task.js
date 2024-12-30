const express = require("express")
const { deleteTask, createTask, getOneTask, getAllTask, updateTask } = require("../controllers/Task")
const authenticate = require("../middleware/auth")

const router = express.Router()

router.use(authenticate)

router.route("/").get(getAllTask).post(createTask)

router.route("/:id").get(getOneTask).patch(updateTask).delete(deleteTask)



module.exports = router