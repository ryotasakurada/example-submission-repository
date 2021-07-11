const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  let userObject = new User(helper.initialUser[0])
  await userObject.save()
  userObject = new User(helper.initialUser[1])
  await userObject.save()
})

test('users are returned as json', async () => {
  await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
})

test('all users are returned', async () => {
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(helper.initialBlog.length)
})

test('a specific blog contains id key', async () => {
  const response = await api.get('/api/users')
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added ', async () => {
  const newUser = {
    name: 'aaaaaaaaaaa',
    username: 'bbbbbbbbbb',
    password: 'beforeencrypted-password',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(helper.initialUser.length + 1)

  const contents = usersAtEnd.map(n => n.name)
  expect(contents).toContain('aaaaaaaaaaa')
})

afterAll(() => {
  mongoose.connection.close()
})

