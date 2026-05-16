import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const actions = useAnecdoteActions()

  const generateId = () => Number((Math.random() * 1000000).toFixed(0))

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    console.log('content: ', content)
    actions.add({ id: generateId(), content: content, votes: 0 })
    e.target.reset()
  }

  return (
    <div>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm