//import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import  { useField } from '../hooks'
import { useAnecdotes } from '../hooks'

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  //const [author, setAuthor] = useState('')
  //const [info, setInfo] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({ 
      content: content.inputProps.value, 
      author: author.inputProps.value, 
      info: info.inputProps.value, 
      votes: 0 
    })
    navigate('/')
  }

  const handleResetAll = () => {
    content.reset()
    author.reset()
    info.reset()
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
          <input  {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input  {...info.inputProps} />
        </div>
        <button>create</button><button type="button" onClick={handleResetAll}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
