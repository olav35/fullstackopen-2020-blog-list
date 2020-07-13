const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialUsers = [
  {
    name: 'Ola Normann',
    username: 'normann',
    passwordHash: 'hufdhauifdbuia'
  },
  {
    name: 'Kari Normann',
    username: 'normann',
    passwordHash: 'bfdhiabuiffbudi'
  }
]

beforeEach(async () => {
  await User.deleteMany({})

  const posts = initialUsers.map(user => new User(user).save())
  await Promise.all(posts)
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

test('returns all users', async () => {
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(initialUsers.length)
})

afterAll(() => {
  mongoose.connection.close()
})