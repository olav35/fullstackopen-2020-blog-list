const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const {INTERNET_SPEED} = require('../utils/config')
const bcrypt = require('bcrypt')


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

const userPassword = 'olaverbest'

const userObject = {
  name: 'Olav',
  username: 'olav',
  passwordHash: bcrypt.hashSync(userPassword, 10)
}


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = new User(userObject)

  initialBlogs.forEach(async blogObject => {
    blogObject.user = user._id
    const blog = new Blog(blogObject)
    await blog.save()
    user.blogs = user.blogs.concat(blog._id)
  })

  await user.save()
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