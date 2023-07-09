//Dev Imports
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const dbConnection = require('./database/connection')
const path = require('path')
//Router Imports
const VehiclesRouter = require('./routes/vehicles')
const RegisterRouter = require('./routes/register')
const UserRouter = require('./routes/user')

const app = express()
dbConnection()
//Server Config
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))

const PORT = process.env.PORT || 3000

//Routes
app.get('/', (req, res) => {
  res.status(200).send({
    status: 'Success ',
    message: 'Welcome to the principal page',
  })
})
app.use('/api/vehicles', VehiclesRouter)
app.use('/api/registers', RegisterRouter)
app.use('/api/users', UserRouter)

//Start Server
app.listen(PORT, () => {
  console.log(`Server listening at PORT : ${PORT}`)
})
