import { useAnecdotes } from '../hooks/useAnecdotes'
//import { useContext } from 'react'
//import NotificationContext from '../NotificationContext' 
//import { useNotify} from '../hooks/useNotify'
import useNotify from '../hooks/useNotify'
const AnecdoteForm = () => {
  const { addAnecdote: addAnecdoteToServer } = useAnecdotes()
  const { setNotification } = useNotify()//useContext(NotificationContext)

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    addAnecdoteToServer(content)

    setNotification(
      `You added anecdote: "${content}"`
    )
    setTimeout(() => setNotification(
      null
    ), 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm