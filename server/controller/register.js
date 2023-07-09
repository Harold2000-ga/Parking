const Register = require('../models/register')
const Vehicle = require('../models/vehicles')
const Validate = require('../helpers/Validate')
const Helpers = require('../helpers/helps')

//Create a newRegister
const create = async (req, res) => {
  //Get data
  const registerParams = req.body
  //Get array of Residents and Official
  const listRes = await Helpers.listResident()
  const listOff = await Helpers.listOfficial()
  //Validate licensePlate if is more than four and alphanumeric
  if (!Validate.ValidateLicensePlate(registerParams.licensePlate)) {
    return res.status(400).send({
      status: 'Error',
      message: 'The license plate must have between 4 and 10 and only alphanumeric characters',
    })
  }
  //Compare if the vehicle is official
  if (listOff.find(plate => plate === registerParams.licensePlate)) {
    registerParams.vehicleType = 'official'
  }
  //Compare if the vehicle is resident
  if (listRes.find(plate => plate === registerParams.licensePlate)) {
    registerParams.vehicleType = 'resident'
  }
  //Verify if the register is inside the parking
  Register.find({ licensePlate: registerParams.licensePlate }).then(item => {
    //If exist register for vehicle and is inside return error
    if (item && item.filter(ele => ele.state === 'Inside').length > 0) {
      return res.status(400).send({
        status: 'Error',
        message: 'The vehicle check-in could not be performed, the vehicle is already inside',
      })
    }
    //Save to database
    const newRegister = new Register(registerParams)
    newRegister
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
          message: 'Register add',
          data: item,
        })
      })
      .catch(error => {
        console.error('Error saving register:', error)
        return res.status(500).send({
          status: 'Error',
          message: 'Could not make a register',
        })
      })
  })
}
//Delete  a register
const remove = (req, res) => {
  //Get id
  const id = req.params.id
  Register.findByIdAndRemove(id)
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'Register not found',
        })
      }
      return res.status(200).send({
        status: 'Success',
        message: 'Register deleted',
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
//List Register
const list = (req, res) => {
  //Find the query list
  state = req.params.state
  let query = {}
  if (state === 'inside') {
    query.state = 'Inside'
  }
  if (state === 'closed') {
    query.state = 'Register Closed'
  }
  Register.find(query)
    .sort({ Input: -1 })
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
//Close Register
const close = async (req, res) => {
  //Get data
  const id = req.params.id
  //Get the register
  Register.findById(id)
    .then(async item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'Vehicle not found',
        })
      }
      // Update Output Date
      item.Output = Date.now()
      //Calculate time in parkin
      item.timeIn = await Helpers.calculateTime(item.Input, item.Output)
      //Update state
      item.state = 'Register Closed'
      //Update payment
      if (item.vehicleType == 'non-resident') {
        item.Payment = item.timeIn * 0.5
      }
      //Compare if the vehicle is resident
      if (item.vehicleType == 'resident') {
        //Update the amount of vehicle
        Vehicle.findOneAndUpdate(
          { licensePlate: item.licensePlate },
          { $inc: { amount: item.timeIn } },
          { new: true }
        ).then(vehicle => {
          if (!vehicle) {
            return res.status(400).send({
              status: 'Error',
              message: 'Could not update the timeIn ',
            })
          }
        })
      }

      //Update the register
      Register.findByIdAndUpdate(id, item, { new: true }).then(register => {
        if (!register) {
          return res.status(400).send({
            status: 'Error',
            message: 'Could not update the register',
          })
        }
        return res.status(200).send({
          status: 'Success',
          message: 'The register has been updated',
          data: register,
        })
      })
    })
    .catch(error => {
      return res.status(500).send({
        status: 'Error',
        error: error.message,
      })
    })

  //Search if official o resident

  //
}
//Get One Register
const register = (req, res) => {
  //Get id
  const id = req.params.id
  Register.findById(id)
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'Register not found',
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

module.exports = { create, remove, list, close, register }
