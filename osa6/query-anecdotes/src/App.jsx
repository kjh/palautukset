import { useContext } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useAnecdotes } from './hooks/useAnecdotes'
import NotificationContext from './NotificationContext'

const App = () => {

  const { setNotification } = useContext(NotificationContext)

  const { anecdotes, isPending, handleVote, isError } = useAnecdotes()

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdoter service is unavailable due problems in server</div>
  }

  const vote = async (anecdote) => {
    handleVote(anecdote)
    setNotification(
      `You voted anecdote: "${anecdote.content}"`
    )
    setTimeout(() => setNotification(
      null
    ), 5000)
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App