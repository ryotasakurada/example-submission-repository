const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.likes) {
    request.body.likes = 0
  }
  if (!request.body.title && !request.body.url, request.body.token) {
    response.status(400).end()
  } else {
    const body = request.body

    const user = await User.findById(request.decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.username,
      url: body.url,
      likes: body.likes,
      user: user.id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    console.log(request.decodedToken)
    const user = await User.findById(request.decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    console.log(blog)
    if(blog.user.toString() === user.id.toString()) {
      blog.delete()
      response.status(204).end()
    } else {
      response.status(401).end()
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const updatingBlog = {
    'title': body.title,
    'author': body.author,
    'url': body.url,
    'likes': body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatingBlog, {new: true})
    response.json(updatedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter