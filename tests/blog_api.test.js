const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Lorem ipsum',
    author: 'Olav Fosse',
    url: 'https://fossegr.im'
  },
  {
    title: 'Lorem ipsum',
    author: 'Ola Normann',
    url: 'https://fossegr.im/emacs/exploring-emacs/2020/06/21/exploring-emacs-II-installation-and-basic-usage.html',
    likes: 99912
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogs = initialBlogs.map(blog => new Blog(blog).save())
  await Promise.all(blogs)
})

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

test('lack of title and url property results in 400 Bad Request status code', async () => {
  const blog = {
    author: 'Olav Fosse',
    likes: 10
  }

  const response = await api.post('/api/blogs').send(blog)
  expect(response.status).toBe(400)
})

test('blog deletion works', async () => {
  const initialCount = await Blog.countDocuments({})
  const blog = await Blog.findOne({})

  await api.delete(`/api/blogs/${blog.id}`).expect(200)

  const count = await Blog.countDocuments({})
  expect(count).toBe(initialCount - 1)
})

afterAll(() => {
  mongoose.connection.close()
})