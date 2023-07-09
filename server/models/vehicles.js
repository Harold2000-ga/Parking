const { Schema, model } = require('mongoose')

const vehicleSchema = new Schema({
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  Owner: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['official', 'resident', 'non-resident'],
    required: true,
  },
  amount: {
    type: Number,
  },
})

module.exports = model('Vehicle', vehicleSchema, 'vehicles')
