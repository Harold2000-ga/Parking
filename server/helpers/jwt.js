const jwt = require('jwt-simple')
const moment = require('moment')

const secret = process.env.TOKEN_PASSWORD

const createToken = user => {
  const payload = {
    id: user.id,
    name: user.name,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix(),
  }
  return jwt.encode(payload, secret)
}

module.exports = { createToken, secret }
