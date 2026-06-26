import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={addBlog}>
        <label>
          Title:
          <input value={newTitle} onChange={event => setNewTitle(event.target.value)} />
        </label>
        <br />
        <label>
          Author:
          <input value={newAuthor} onChange={event => setNewAuthor(event.target.value)} />
        </label>
        <br />
        <label>
          Url:
          <input value={newUrl} onChange={event => setNewUrl(event.target.value)} />
        </label>
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm