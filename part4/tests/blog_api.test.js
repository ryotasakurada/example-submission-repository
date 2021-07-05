const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const initialBlog = [
  {
    title: 'hello',
    author: 'world',
    url: 'https://xxxxxxxxxxxxxxxx',
    likes: 1111
  },
  {
    title: 'foo',
    author: 'bar',
    url: 'https://yyyyyyyyyyyyyyyyyyy',
    likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(initialBlog[0])
  await noteObject.save()
  noteObject = new Blog(initialBlog[1])
  await noteObject.save()
})

test('blogs are returned as json', async () => {
  await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlog.length)
})

test('a specific blog contains id key', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})

