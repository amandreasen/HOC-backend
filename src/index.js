const express = require('express')
const rootRouter = require('./routers/root')
const userRouter = require('./routers/users')
const groupRouter = require('./routers/groups')
const searchRouter = require('./routers/search');

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use('/', rootRouter)
app.use('/users', userRouter)
app.use('/groups', groupRouter)
app.use('/search', searchRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
