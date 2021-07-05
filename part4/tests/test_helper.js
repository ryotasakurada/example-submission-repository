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

module.exports = {
  initialBlog, nonExistingId, blogsInDb
}
