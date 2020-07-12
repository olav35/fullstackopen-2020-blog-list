const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are succesfully returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type',/application\/json/)
})

test('the number of blogs returned by the api is equal to the number of blogs in the database', async () => {
  const response = await api.get('/api/blogs')
  const count = await Blog.countDocuments({})

  expect(response.body).toHaveLength(count)
})

test('the id of blogs is given as the id key', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('post creation works', async () => {
  const initialLength = await Blog.countDocuments({})

  const blog = {
    title: 'Lorem ipsum',
    author: 'Olav Fosse',
    url: 'https://fossegr.im',
    likes: 99912
  }

  await api.post('/api/blogs').send(blog).expect(201)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialLength + 1)
})

test('lack of likes property results in 0 in api', async () => {
  const blog = {
    title: 'Lorem ipsum',
    author: 'Olav Fosse',
    url: 'https://fossegr.im'
  }

  const response = await api.post('/api/blogs').send(blog)
  expect(response.body.likes).toBe('0')
})

afterAll(() => {
  mongoose.connection.close()
})