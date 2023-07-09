const XlsxPopulate = require('xlsx-populate')
const Vehicle = require('../models/vehicles')
const XLSX = require('xlsx')

const listResident = async () => {
  //Get all residents vehicles
  const residentsVehicles = await Vehicle.find({ vehicleType: 'resident' }).select({
    licensePlate: 1,
  })
  const cleanList = residentsVehicles.map(item => item.licensePlate)
  return cleanList
}

const listOfficial = async () => {
  const residentsVehicles = await Vehicle.find({ vehicleType: 'official' }).select({
    licensePlate: 1,
  })
  const cleanList = residentsVehicles.map(item => item.licensePlate)
  return cleanList
}

const calculateTime = async (date1, date2) => {
  const diffMs = Math.abs(date2 - date1)
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  return diffMinutes
}
const sendExcelFile = (res, fileName, month) => {
  console.log(month)
  console.log(fileName)
  // Create a new book
  const book = XLSX.utils.book_new()

  // Create a new sheet
  const sheet = XLSX.utils.json_to_sheet(month)

  // Add the sheet
  XLSX.utils.book_append_sheet(book, sheet, 'Report')
  // Became into the buffer file
  const file = XLSX.write(book, { type: 'buffer' })

  // Config Headers
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`)

  res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.send(file)
}

module.exports = { listResident, listOfficial, calculateTime, sendExcelFile }
