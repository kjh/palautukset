const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'this is test',
    author: 'erkki miettinen',
    url: 'http://testing.org',
    likes: 1
  },
  {
    title: 'will it work',
    author: 'tiina testaaja',
    url: 'http://testing-more.org',
    likes: 2
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'this is test',
    author: 'erkki miettinen',
    url: 'http://testing.org',
    likes: 1
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}