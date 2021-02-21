// imports
const express = require('express')
const app = express()
const cors = require('cors')

// middleware
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: "50mb"}))

app.get("/", (req, res) => {
    res.send("You have hit the backend!")
})

app.use("/users", require("./api/userRoutes"))
app.use("/about", require("./api/aboutRoutes"))
app.use("/blurb", require("./api/blurbRoutes"))
app.use("/link", require("./api/linkRoutes"))
app.use("/soundtrack", require("./api/soundtrackRoutes"))
app.use("/content", require("./api/contentRoutes"))
app.use("/cloudinary", require("./api/cloudinaryRoutes"))

const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
    console.log(`🔥You are listening on PORT: ${PORT}🔥`);
})

module.exports = server