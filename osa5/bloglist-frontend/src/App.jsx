import { useState, useEffect, useRef } from 'react'
//import Footer from './components/Footer'
import Blog from './components/Blog'
import Notification from './components/Notification'
//import LoginForm from './components/LoginForm'
//import NoteForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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
    blogFormRef.current.toggleVisibility()

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
  )

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notificationMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
        </div>
      )}
      {user && (
        <div>
          {blogs.map(blog => (

            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}
            />

          ))}
        </div>
      )}


    </div>
  )
}

export default App