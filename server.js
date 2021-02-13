// imports
const express = require('express')
const app = express()

// middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("You have hit the backend!")
})

const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
    console.log(`🔥You are listening on PORT: ${PORT}🔥`);
})

module.exports = server