const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('', async (request, response) => {
  const userObject = {
    name: request.body.name,
    username: request.body.username,
    passwordHash: await bcrypt.hash(request.body.name, 10)
  }
  const user = new User(userObject)
  await user.save()

  response.status(201).send(user)
})

module.exports = usersRouter