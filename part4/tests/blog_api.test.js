const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')
beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(helper.initialBlog[0])
  await noteObject.save()
  noteObject = new Blog(helper.initialBlog[1])
  await noteObject.save()
})

test('blogs are returned as json', async () => {
  await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlog.length)
})

test('a specific blog contains id key', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'aaaaaaaaaaa',
    author: 'bbbbbbbbbb',
    url: 'https://aaaaaaaaaaaaaaaaaa',
    likes: 99
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'aaaaaaaaaaa'
  )
})



afterAll(() => {
  mongoose.connection.close()
})

