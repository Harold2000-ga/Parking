const User = require('../models/user')
const bcrypt = require('bcrypt')
const { createToken } = require('../helpers/jwt')

//Create a newRegister
const register = (req, res) => {
  //Get data
  let params = req.body

  //Validate
  if (!params.name || !params.password) {
    return res.status(400).json({
      status: 'Error',
      message: 'Not enough data',
    })
  }
  //Double user
  User.find({ name: params.name.toLowerCase() })
    .exec()
    .then(async user => {
      if (user && user.length >= 1) {
        return res.status(200).send({
          status: 'Success',
          message: 'User already exist',
        })
      }
      //Password
      let password = await bcrypt.hash(params.password, 10)
      params.password = password
      //Create object
      let user_save = new User(params)
      //Save in database
      user_save
        .save()
        .then(user => {
          return res.status(200).send({
            status: 'Success',
            message: 'User register',
            user,
          })
        })
        .catch(error => {
          return res.status(500).send({
            status: 'Error',
            message: 'Error in save to database',
            error,
          })
        })
      //Response
    })
    .catch(error => {
      return res.status(400).send({
        status: 'Error',
        message: 'Error in find',
        error,
      })
    })

  //
}
const login = (req, res) => {
  //Get Params
  const params = req.body
  if (!params.password || !params.name) {
    return res.status(400).send({
      status: 'Error',
      message: 'No enough data',
    })
  }
  //Search in database
  User.findOne({ name: params.name })
    .then(user => {
      if (!user) {
        return res.status(400).send({
          status: 'Error',
          message: 'The user no exist',
        })
      }
      //Verify credential
      let password = bcrypt.compareSync(params.password, user.password)
      if (!password) {
        return res.status(400).send({
          status: 'Error',
          message: 'Wrong password',
        })
      }
      //Return token

      let token = createToken(user)
      //Return user data
      return res.status(200).send({
        status: 'Success',
        message: 'test',
        user: { id: user._id, name: user.name },
        token,
      })
    })
    .catch(error => {
      return res.status(400).send({
        status: 'Error',
        message: 'Error in find',
        error,
      })
    })
}
const remove = (req, res) => {
  //Get id
  const id = req.params.id
  User.findByIdAndRemove(id)
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'User not found',
        })
      }
      return res.status(200).send({
        status: 'Success',
        message: 'User deleted',
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

module.exports = { register, login, remove }
