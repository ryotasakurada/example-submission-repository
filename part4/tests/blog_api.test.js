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

test('a valid blog can be added even if likes parameter is missing', async () => {
  const newBlog = {
    title: 'aaaaaaaaaaa',
    author: 'bbbbbbbbbb',
    url: 'https://aaaaaaaaaaaaaaaaaa'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)

  // もっといい方法あるはずだけど思いつかなかった likesがdefaultで0を入るようにするやつ
  expect(blogsAtEnd.[blogsAtEnd.length - 1].likes).toBe(0)
})

test('blog without title and URL is not added', async () => {
  const newBlog = {
    author: 'bbbbbbbbbb',
    likes: 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const notesAtEnd = await helper.blogsInDb()

  expect(notesAtEnd).toHaveLength(helper.initialBlog.length)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlog.length - 1
    )
    const title = blogsAtEnd.map(r => r.title)
    expect(title).not.toContain(blogToDelete.title)
  })

  test('failed with status code 404 if id is not exists', async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api.delete(`/api/blogs/d9c69d1dd52`)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlog.length
    )
  })
})

afterAll(() => {
  mongoose.connection.close()
})

