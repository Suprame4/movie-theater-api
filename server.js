const express = require('express')
const app = express()
const {db, DataTypes} = require('./db')

const port = 3000

const movieRouter = require('./routes/movie_route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('', movieRouter)

app.listen(port, () => {
    db.sync()
    console.log(`Listening on port ${port}`)
})