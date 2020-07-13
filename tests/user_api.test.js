const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

const userObject = {
  name: 'Olav Fosse',
  username: 'fossegrim',
  password: 's34per s0kr47 pa5580rd'
}

test('adds a user to the database', async () => {
  const initialCount = await User.countDocuments({})

  await api.post('/api/users').send(userObject)

  const currentCount = await User.countDocuments({})
  expect(currentCount).toBe(initialCount + 1)
})

test('does not return the password hash', async () => {
  const response = await api.post('/api/users').send(userObject)

  expect(response.body.passwordHash).toBeUndefined()
})

afterAll(() => {
  mongoose.connection.close()
})