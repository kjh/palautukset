import { useState, useEffect, useRef } from 'react'
//import Footer from './components/Footer'
import Blog from './components/Blog'
import SingleBlog from './components/SingleBlog'
import Notification from './components/Notification'
//import LoginForm from './components/LoginForm'
//import NoteForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'

import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch
} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
/*
//import BloglistList from './components/BlogList'
import Home from './components/Home'
import Footer from './components/Footer'*/

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      //initialBlogs.sort((a, b) => a.likes - b.likes)
      //setBlogs(initialBlogs)
      setBlogs(initialBlogs.sort((a, b) => a.likes - b.likes))
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = blogObject => {
    //blogFormRef.current.toggleVisibility()

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => a.likes - b.likes))
      setNotificationMessage({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 5000)
    })
  }

  const updateBlog = blogObject => {
    blogService.update(blogObject).then(returnedBlog => {
      setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog).sort((a, b) => a.likes - b.likes))
      setNotificationMessage({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} updated`, type: 'success' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 5000)
    })
  }

  const deleteBlog = blogObject => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)) {
      blogService.remove(blogObject).then(() => {
        navigate('/')
        setBlogs(blogs.filter(b => b.id !== blogObject.id))
        setNotificationMessage({ message: `blog ${blogObject.title} by ${blogObject.author} deleted`, type: 'success' })
        setTimeout(() => {
          setNotificationMessage({ message: null, type: null })
        }, 5000)
      })
    }
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('user logged in')
      navigate('/')
    } catch {
      setNotificationMessage({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 5000)
    }
  }

  /*const handleTitleChange = event => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = event => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = event => {
    setNewUrl(event.target.value)
  }*/

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    window.location.reload()
  }

  const loginForm = () => (
    <div>
      <h1>Log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user && (
          <Link style={padding} to="/create">new blog</Link>
        )}
        {user && (
          <button onClick={handleLogout}>logout</button>
        )}
        {!user && <Link style={padding} to="/login">login</Link>}
      </div>

      <Routes>
        <Route path="/create" element={
          user && (
            <div>
              <BlogForm createBlog={addBlog} />
            </div>
          )
        } />
        <Route path="/" element={
          <div>
            <h1>Blogs</h1>
            <ul>
              {blogs.map(blog => (
                <li key={blog.id}>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        } />
        <Route path="/login" element={
          !user && loginForm()
        } />
        <Route path="/create" element={
          user && (
            <div>
              {blogForm()}
            </div>
          )
        } />
        <Route path="/blogs/:id" element={
          blog ? (
            <SingleBlog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}
            />
          ) : (
            <div>No blog found</div>
          )
        } />
      </Routes>

    </div>
  )
}

export default App