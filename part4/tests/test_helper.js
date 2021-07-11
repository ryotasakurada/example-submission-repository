const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUser = [
  {
    name: 'name1',
    username: 'username1',
    password: 'jfioeuwah3g894io3kwjegirhug9ioei',
  },
  {
    name: 'foo',
    username: 'bar',
    password: 'jgeraj8u9igo3ekljuibhw98qi03opktl;g',
  }
]

const nonExistingId = async () => {
  const blog = new Blog({})
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlog, nonExistingId, blogsInDb, initialUser, usersInDb
}
