import { useState, useEffect } from 'react'


export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    inputProps: {
        type,
        value,
        onChange,
    },
    reset
  }
}

// modules can have several named exports
import anecdoteService from '../services/anecdotes'

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = (anecdote) => {
    return anecdoteService.createNew(anecdote)
  }

  const deleteAnecdote = (id) => {
    setAnecdotes(filtered => filtered.filter(a => a.id !== id))
    return anecdoteService.remove(id)
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}