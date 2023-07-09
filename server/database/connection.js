const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL)
    console.log('** CONNECTED TO DATABASE **')
  } catch (error) {
    console.log(error, '** ERROR IN  CONNECTION TO DB **')
  }
}

module.exports = dbConnection
