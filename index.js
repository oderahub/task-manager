const express = require("express");
const Taskrouter = require("./src/routes/Task")
const connectToDb = require("./database/db")
const notFound = require("./src/middleware/not-found")
const errorHandler = require("./src/middleware/errorHandler")
const dotenv = require("dotenv")
const Userrouter = require("./src/routes/User");
const authenticate = require("./src/middleware/auth");

dotenv.config()

const app = express()




//middleware
app.use(express.static("./public"))
app.use(express.json())

app.use("/api/v1/users", Userrouter)


// Apply the authentication middleware to only task routes that need authentication
app.use(authenticate)

app.use("/api/v1/tasks", Taskrouter)



app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

app.listen(port, async () => {

    try {
        await connectToDb()
        console.log(`app is running on ${port}...`)
    } catch (error) {
        console.error("Failed to connect to Database", error.message)
    }
})