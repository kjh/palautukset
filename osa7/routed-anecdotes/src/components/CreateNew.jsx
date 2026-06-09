import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import  { useField } from '../hooks'
import { useAnecdotes } from '../hooks'

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  const content = useField('text')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({ content: content.inputProps.value, author, info, votes: 0 })
    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input  {...content.inputProps} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <button>create</button><button type="button" onClick={content.reset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
