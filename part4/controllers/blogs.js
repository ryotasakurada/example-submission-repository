const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  if(!request.body.likes) {
    request.body.likes = 0
  }
  if(!request.body.title && !request.body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog(request.body)

    const result = blog.save()
    response.status(201).json(result)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
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
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatingBlog, { new: true })
    response.json(updatedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter