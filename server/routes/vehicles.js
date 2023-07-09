//Imports
const express = require('express')
const router = express.Router()
const vehicleController = require('../controller/vehicles')
const check = require('../middleware/auth')

//Router

router.get('/list/:type?', check.auth, vehicleController.list)
router.get('/vehicle/:id', check.auth, vehicleController.vehicle)
router.delete('/vehicle/:id', check.auth, vehicleController.remove)
router.put('/vehicle/:id', check.auth, vehicleController.update)
router.post('/create', check.auth, vehicleController.create)
router.put('/closeMonth', check.auth, vehicleController.closeMonth)
router.post('/registerMonth', check.auth, vehicleController.registerMonth)

//Export
module.exports = router
