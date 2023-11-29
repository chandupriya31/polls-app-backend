require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express() 

const port = process.env.PORT || 3030

const userCtlr = require('./app/controllers/user-ctlr')

const configureDB = require('./config/db')
const routes = require('./config/routes')

const {checkSchema} = require('express-validator')
const { userRegisterationSchema, userLoginSchema } = require('./app/helpers/userValidationSchema')
const { authenticateUser } = require('./app/middlewares/authenticateUser')

const categoryValidationSchema = require('./app/helpers/categoryValidationSchema')
const pollValidationSchema = require('./app/helpers/pollValidationSchema')
const voteValidationSchema = require('./app/helpers/voteValidationSchema')

const catCtlr = require('./app/controllers/cat-ctlr')
const pollCtlr = require('./app/controllers/polls-ctlr')
const voteCtlr = require('./app/controllers/vote-ctlr')

configureDB()
app.use(express.json())
app.use(cors()) 
app.use('/',routes)

app.post('/api/user/register',checkSchema(userRegisterationSchema),userCtlr.register)
app.post('/api/user/login',checkSchema(userLoginSchema),userCtlr.login)
app.get('/api/user/account',authenticateUser,userCtlr.account)

app.post('/api/categories',authenticateUser,checkSchema(categoryValidationSchema),catCtlr.create)
app.get('/api/categories',catCtlr.list)

app.get('/api/polls/active',pollCtlr.active)
app.post('/api/polls',authenticateUser,checkSchema(pollValidationSchema),pollCtlr.create)
app.get('/api/polls/mypolls',authenticateUser,pollCtlr.mypolls)
app.get('/api/polls/category/:name',pollCtlr.category)

app.get('/api/votes/myvotes',authenticateUser,voteCtlr.myVotes)
app.post('/api/vote/:pollId',authenticateUser,checkSchema(voteValidationSchema),voteCtlr.create)

app.listen(port, () => {
    console.log('server running on port', port)
})