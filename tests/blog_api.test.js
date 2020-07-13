const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const {INTERNET_SPEED} = require('../utils/config')

const api = supertest(app)

if(INTERNET_SPEED === 'slow'){
  jest.setTimeout(30000)
}

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

  console.log(response)
  console.log(count)

  expect(response.body).toHaveLength(count)
})

test('the id of blogs is given as the id key', async () => {
  // getting it retries nothing hmmm..
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('blog deletion works', async () => {
  const initialCount = await Blog.countDocuments({})
  const blog = await Blog.findOne({})

  await api.delete(`/api/blogs/${blog.id}`).expect(200)

  const count = await Blog.countDocuments({})
  expect(count).toBe(initialCount - 1)
})

test('blog liking works', async () => {
  const blog = await Blog.findOne({})
  blog.likes = Number(blog.likes) + 5

  await api.put(`/api/blogs/${blog._id}`).send(blog) // .toObject?

  const updatedBlog = await Blog.findById(blog._id)
  expect(updatedBlog.likes).toBe(blog.likes)
})

afterAll(() => {
  mongoose.connection.close()
})