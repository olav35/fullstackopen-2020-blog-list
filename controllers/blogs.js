const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('', async (_request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('', async (request, response) => {
  const body = request.body
  if(!body.title && !body.url) {
    return response.status(400).send()
  } else {
    const blog = new Blog(body)
    const result = await blog.save()
    response.status(201).json(result)
  }
})

module.exports = blogsRouter