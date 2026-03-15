const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, item) => sum + item.likes, 0)
}
const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((max, blog) => {
      return blog.likes > max.likes ? blog : max
    })
}

const mostBlogs = (blogs) => {
  return blogs.length === 0
    ? null
    : _
      .chain(blogs)
      .countBy('author')
      .toPairs()
      .maxBy(pair => pair[1])
      .thru(([author, count]) => ({ author, blogs: count }))
      .value()
}

const mostLikes = (blogs) => {
  return blogs.length === 0
    ? null
    : _
      .chain(blogs)
      .groupBy('author')
      .map((blogPosts, author) => ({ author, likes: _.sumBy(blogPosts, 'likes') }))
      .maxBy('likes')
      .value()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}