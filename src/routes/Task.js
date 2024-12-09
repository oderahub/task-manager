const express = require("express")
const { deleteTask, createTask, getOneTask, getAllTask, updateTask } = require("../controllers/Task")

const router = express.Router()

router.route("/").get(getAllTask).post(createTask)

router.route("/:id").get(getOneTask).put(updateTask).delete(deleteTask)



module.exports = router