const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type',/application\/json/)
})

test('the number of blogs returned by the api is equal to the number of blogs in the database', async () => {
  const response = await api.get('/api/blogs')
  const count = await Blog.count({})

  expect(response.body).toHaveLength(count)
})

afterAll(() => {
  mongoose.connection.close()
})