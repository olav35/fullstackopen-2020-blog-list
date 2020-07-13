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

test('not created if no username', async () => {
  const initialCount = await User.countDocuments({})
  let noUsername = {...userObject}
  delete noUsername.username

  const response = await api.post('/api/users').send(noUsername)
  const count = await User.countDocuments({})

  expect(count).toBe(initialCount)
  expect(response.status).toBe(400)
  expect(response.body.error).toBeDefined()
})

test('not created if no password', async () => {
  const initialCount = await User.countDocuments({})
  let noPassword = {...userObject}
  delete noPassword.password

  const response = await api.post('/api/users').send(noPassword)
  const count = await User.countDocuments({})

  expect(count).toBe(initialCount)
  expect(response.status).toBe(400)
  expect(response.body.error).toBeDefined()
})

test('not created if username is not unique', async () => {
  const initialCount = await User.countDocuments({})
  await api.post('/api/users').send(userObject)
  const response = await api.post('/api/users').send(userObject)
  const count = await User.countDocuments({})

  expect(count).toBe(initialCount + 1)
  expect(response.status).toBe(400)
  expect(response.body.error).toBeDefined()
})

test('not created if username is under 3 characters long', async () => {
  const initialCount = await User.countDocuments({})
  const user = {...userObject}
  user.username = '12'
  const response = await api.post('/api/users').send(user)
  const count = await User.countDocuments({})

  expect(count).toBe(initialCount)
  expect(response.status).toBe(400)
  expect(response.body.error).toBeDefined()
})

test('not created if password is under 3 characters long', async () => {
  const initialCount = await User.countDocuments({})
  const user = {...userObject}
  user.password = '12'
  const response = await api.post('/api/users').send(user)
  const count = await User.countDocuments({})

  expect(count).toBe(initialCount)
  expect(response.status).toBe(400)
  expect(response.body.error).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})