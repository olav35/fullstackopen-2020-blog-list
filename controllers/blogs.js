const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../utils/config')

blogsRouter.get('', async (_request, response) => {
  const fields = {
    name: 1,
    username: 1
  }

  const blogs = await Blog.find({}).populate('user', fields)
  response.json(blogs)
})

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

blogsRouter.post('', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, SECRET)

  if(!token || !decodedToken.id){
    return response.status(401).json({error: 'token missing or invalid'})
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog({...request.body, user: user._id})
  const result = await blog.save()
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