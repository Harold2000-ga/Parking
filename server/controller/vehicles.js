//Imports
const Vehicles = require('../models/vehicles')
const Validate = require('../helpers/Validate')
const Helps = require('../helpers/helps')

//Register new Vehicle to database
const create = (req, res) => {
  //Get data
  const vehicleParams = req.body
  //Validate licensePlate if is more than four and alphanumeric
  if (!Validate.ValidateLicensePlate(vehicleParams.licensePlate)) {
    return res.status(400).send({
      status: 'Error',
      message: 'The license plate must have between 4 and 10 and only alphanumeric characters',
    })
  }
  //Validate the vehicleType
  if (!vehicleParams.vehicleType) {
    return res.status(400).send({
      status: 'Error',
      message: 'Type of vehicle must be enter',
    })
  }
  //Add amount to vehicle resident
  if (vehicleParams.vehicleType == 'resident') {
    vehicleParams.amount = 0
  }

  //Save to database
  const newVehicle = new Vehicles(vehicleParams)
  newVehicle
    .save()
    .then(item => {
      //Verify if was add
      if (!item) {
        return res.status(500).send({
          status: 'Error',
        })
      }
      return res.status(200).send({
        status: 'Success',
        message: 'Vehicles add',
        data: item,
      })
    })
    .catch(error => {
      //If exist already in database
      if (error.code === 11000) {
        return res.status(400).send({
          status: 'Error',
          message: 'The vehicle is already in the database',
        })
      } else {
        console.error('Error saving vehicle:', error)
        return res.status(500).send({
          status: 'Error',
          message: 'Could not save vehicle',
        })
      }
    })
}
//List Vehicles
const list = (req, res) => {
  //Verify if list is by type
  type = req.params.type
  let query = {}
  if (type == 'official' || type == 'resident' || type == 'non-resident') query.vehicleType = type

  //Find the query list
  Vehicles.find(query)
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'The list is empty',
        })
      }
      return res.status(200).send({
        status: 'Success',
        data: item,
      })
    })
    .catch(error => {
      return res.status(404).send({
        status: 'Error',
        message: error.message,
      })
    })
}
//Remove a vehicle
const remove = (req, res) => {
  //Get id
  const id = req.params.id
  Vehicles.findByIdAndRemove(id)
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'Vehicle not found',
        })
      }
      return res.status(200).send({
        status: 'Success',
        message: 'Vehicle deleted',
        data: item,
      })
    })
    .catch(error => {
      return res.status(500).send({
        status: 'Error',
        error: error.message,
      })
    })
}
//Get one vehicle
const vehicle = (req, res) => {
  //Get id
  const id = req.params.id
  Vehicles.findById(id)
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'Vehicle not found',
        })
      }
      return res.status(200).send({
        status: 'Success',
        data: item,
      })
    })
    .catch(error => {
      return res.status(500).send({
        status: 'Error',
        error: error.message,
      })
    })
}
//Update vehicle to official o resident
const update = (req, res) => {
  //get params
  const id = req.params.id
  const updates = req.body
  const licensePlateRegex = /^[A-Za-z0-9]{4,}$/

  // Validate licensePlate
  if (!licensePlateRegex.test(updates.licensePlate)) {
    return res.status(400).send({
      status: 'Error',
      message: 'The license plate must have at least 4 alphanumeric characters',
    })
  }

  Vehicles.findByIdAndUpdate(id, updates, { new: true })
    .then(updatedItem => {
      if (!updatedItem) {
        return res.status(404).send({
          status: 'Error',
          message: 'Vehicle not found',
        })
      }

      return res.status(200).send({
        status: 'Success',
        message: 'Vehicle updated successfully',
        data: updatedItem,
      })
    })
    .catch(error => {
      return res.status(500).send({
        status: 'Error',
        message: error.message,
      })
    })
}
//Close Month
const closeMonth = (req, res) => {
  const monthRegister = []
  Vehicles.find({ $and: [{ vehicleType: 'resident' }, { amount: { $gt: 0 } }] })
    .then(residentVehicles => {
      for (const vehicle of residentVehicles) {
        const timeObj = {
          licensePlate: vehicle.licensePlate,
          Time_Min: vehicle.amount,
          Payment_$MXN: (vehicle.amount * 0.05).toFixed(2),
        }
        Math.round()
        monthRegister.push(timeObj)
      }
      Vehicles.updateMany({ vehicleType: 'resident' }, { $set: { amount: 0 } })
        .then(result => {
          return res.status(200).send({
            status: 'Success',
            message: 'The month has been close',
            dataPayments: monthRegister,
          })
        })
        .catch(error => {
          console.error(`Error updating documents: ${error}`)
        })
    })
    .catch(error => {
      console.error(`Error getting resident times: ${error}`)
    })
}
//Register Month
const registerMonth = (req, res) => {
  //Get data
  const fileName = req.body.fileName
  const month = req.body.month
  Helps.sendExcelFile(res, fileName, month)
}

module.exports = { create, list, remove, vehicle, update, closeMonth, registerMonth }
