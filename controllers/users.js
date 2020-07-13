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

usersRouter.get('', async (request, response) => {
  const users = await User.find({})
  response.status(200).json(users)
})

module.exports = usersRouter