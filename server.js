const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const PORT = process.env.PORT ? process.env.PORT : "3000"

const authCtrl = require('./controllers/auth')
const usersCtrl = require('./controllers/users')
const meetingCtrl = require('./controllers/meetings-controller')
const workspaceCtrl = require('./controllers/workspace-controller')
const tasksCtrl = require('./controllers/tasks-controller')


const verifyToken = require('./middleware/verify-token')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}. 🥭`)
})

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes go here
// app.get('/auth/sign-token', authCtrl.signToken)
// app.get('/auth/verify-token', authCtrl.verifyToken)
app.post('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-in', authCtrl.signIn)

// meetings router
// app.post('/meetings', verifyToken, meetingCtrl.create)

// task controller
app.post('/tasks', verifyToken, tasksCtrl.create)
app.get('/tasks', verifyToken, tasksCtrl.index)
app.get('/tasks/:taskId', verifyToken, tasksCtrl.show)
app.put('/tasks/:taskId', verifyToken, tasksCtrl.update)
app.delete('/tasks/:taskId', verifyToken, tasksCtrl.deleteTask)

//workspace controller 
app.post('/workspace', verifyToken, workspaceCtrl.create)
app.get('/workspace', verifyToken, workspaceCtrl.index)
app.get('/workspace/:workspaceId', verifyToken, workspaceCtrl.show)
app.put('/workspace/:workspaceId', verifyToken, workspaceCtrl.update)
app.delete('/workspace/:workspaceId', verifyToken, workspaceCtrl.deleteWorkspace)

app.get('/users', verifyToken, usersCtrl.index)

app.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}! 😀`)
})
