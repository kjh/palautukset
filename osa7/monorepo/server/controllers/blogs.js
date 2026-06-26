const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const { userExtractor } = require('../utils/middleware')


//const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  //const blogs = await Blog.find({}) 
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user 

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  if (!user) {
    return response.status(400).json({ error: 'user not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const blogWithUser = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(blogWithUser)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'user not valid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // blog.user on ObjectId → muutetaan stringiksi
  if (blog.user.toString() !== user.id) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

  if (blog) {
    if (title !== null && title !== undefined) blog.title = title 
    if (author !== null && author !== undefined) blog.author = author
    if (url !== null && url !== undefined) blog.url = url
    if (likes !== null && likes !== undefined) blog.likes = likes
    
    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter