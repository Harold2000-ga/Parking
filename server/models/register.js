const { Schema, model } = require('mongoose')

const registerSchema = new Schema({
  licensePlate: {
    type: String,
    required: true,
  },
  Input: {
    type: Date,
    default: Date.now(),
  },
  Output: {
    type: Date,
  },
  state: {
    type: String,
    default: 'Inside',
  },
  vehicleType: {
    type: String,
    enum: ['official', 'resident', 'non-resident'],
    default: 'non-resident',
  },
  timeIn: {
    type: Number,
  },
  Payment: {
    type: Number,
    default: 0,
  },
})

module.exports = model('Register', registerSchema, 'registers')
