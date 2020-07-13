const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('', async (request, response) => {
  const body = request.body
  if(typeof body.password !== 'string'){
    return response.status(400).json({ error: 'password must be string'})
  }
  else if(body.password.length < 3) {
    return response.status(400).json({ error: 'password is under 3 characters'})
  }

  const userObject = {
    name: body.name,
    username: body.username,
    passwordHash: await bcrypt.hash(body.password, 10)
  }
  const user = new User(userObject)
  await user.save()

  response.status(201).send(user)
})

usersRouter.get('', async (request, response) => {
  const fields = {
    likes: 1,
    title: 1,
    author: 1,
    url: 1
  }
  const users = await User.find({}).populate('blogs', fields)
  response.status(200).json(users)
})

module.exports = usersRouter