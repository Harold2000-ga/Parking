//Imports
const express = require('express')
const router = express.Router()
const userController = require('../controller/user')

//Router
router.post('/register', userController.register)
router.post('/login', userController.login)
router.delete('/remove/:id', userController.remove)

//Export
module.exports = router
