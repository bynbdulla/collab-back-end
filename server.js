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

const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"])

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
app.post('/workspaces/:workspaceId/meetings', verifyToken, meetingCtrl.create)
app.get('/workspaces/:workspaceId/meetings', verifyToken , meetingCtrl.index)
app.get('/workspaces/:workspaceId/meetings/:meetingId', verifyToken , meetingCtrl.show)
app.put('/workspaces/:workspaceId/meetings/:meetingId', verifyToken , meetingCtrl.update)
app.delete('/workspaces/:workspaceId/meetings/:meetingId', verifyToken, meetingCtrl.deleteMeeting)

// task controller
app.post('/workspaces/:workspaceId/tasks', verifyToken, tasksCtrl.create)
app.get('/workspaces/:workspaceId/tasks', verifyToken, tasksCtrl.index)
app.get('/workspaces/:workspaceId/tasks/:taskId', verifyToken, tasksCtrl.show)
app.put('/workspaces/:workspaceId/tasks/:taskId', verifyToken, tasksCtrl.update)
app.delete('/workspaces/:workspaceId/tasks/:taskId', verifyToken, tasksCtrl.deleteTask)

//workspace controller 
app.post('/workspaces', verifyToken, workspaceCtrl.create)
app.get('/workspaces', verifyToken, workspaceCtrl.index)
app.get('/workspaces/:workspaceId', verifyToken, workspaceCtrl.show)
app.put('/workspaces/:workspaceId', verifyToken, workspaceCtrl.update)
app.delete('/workspaces/:workspaceId', verifyToken, workspaceCtrl.deleteWorkspace)
app.post('/workspaces/:workspaceId/members', verifyToken, workspaceCtrl.addMember)
app.delete('/workspaces/:workspaceId/members/:userId',verifyToken , workspaceCtrl.removeMember )

app.get('/users', verifyToken, usersCtrl.index)

app.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}! 😀`)
})
