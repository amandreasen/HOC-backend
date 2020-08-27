require('dotenv').config()

const express = require('express')
const userRouter = require('./routers/users')
const groupRouter = require('./routers/groups')

const app = express()
const port = 3000

app.use(express.json())
app.use('/users', userRouter)
app.use('/groups', groupRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
