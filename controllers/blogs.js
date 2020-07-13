const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('', async (_request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('', async (request, response, next) => {
  try {
    const body = request.body
    const blog = new Blog(body)
    const result = await blog.save()
    response.status(201).json(result)
  } catch (exception) {
    next(exception)
  }
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