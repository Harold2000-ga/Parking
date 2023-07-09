//Imports
const express = require('express')
const router = express.Router()
const registerController = require('../controller/register')
const check = require('../middleware/auth')

//Router
router.post('/create', check.auth, registerController.create)
router.delete('/register/:id', check.auth, registerController.remove)
router.get('/list/:state?', check.auth, registerController.list)
router.put('/register/:id', check.auth, registerController.close)
router.get('/register/:id', check.auth, registerController.register)
//Export
module.exports = router
