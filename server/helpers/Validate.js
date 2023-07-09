//Validate licensePlate if is more than four and alphanumeric
const ValidateLicensePlate = string => {
  const licensePlateRegex = /^[A-Za-z0-9]{4,10}$/
  return licensePlateRegex.test(string)
}

module.exports = { ValidateLicensePlate }
