const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('', async (_request, response) => {
  const fields = {
    name: 1,
    username: 1
  }

  const blogs = await Blog.find({}).populate('user', fields)
  response.json(blogs)
})

blogsRouter.post('', async (request, response) => {
  const user = await User.findOne({})
  const body = request.body
  const blog = new Blog({...body, user: user._id})
  const result = await blog.save()
  console.log('result')
  console.log(result._id)
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  await Blog.findByIdAndDelete(id)
  response.status(200).send()
})

blogsRouter.put('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.status(200).send(request.body)
})

module.exports = blogsRouter