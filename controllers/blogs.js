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

blogsRouter.post('', async (request, response) => {
  const decodedToken = jwt.verify(request.token, SECRET)

  if(!request.token || !decodedToken.id){
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
  const decodedToken = jwt.verify(request.token, SECRET)
  
  if(!request.token || !decodedToken.id){
    return response.status(401).json({error: 'token missing or invalid'})
  }

  const blog = await Blog.findById(request.params.id)
  const blogUserId = blog.user.toString()

  if(blogUserId === decodedToken.id) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(200).send()
  } else {
    response.status(403).json({ error: 'not permission to delete'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.status(200).send(request.body)
})

module.exports = blogsRouter