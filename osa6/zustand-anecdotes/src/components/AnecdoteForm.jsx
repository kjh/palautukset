import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const actions = useAnecdoteActions()

  const addAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    if (!content) return
    console.log('content: ', content)
    await actions.add(content)
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