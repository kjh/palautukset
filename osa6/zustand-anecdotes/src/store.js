
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'


const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useNotificationStore = create((set, get) => ({
  notification: null,
  actions: {
    setNotification: value => set(() => ({ notification: value }))
  }
}))

const useAnecdoteStore = create((set, get) => ({
  filter: null,
  anecdotes: [],
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content) // storeen
      set(
        state => ({ 
          anecdotes: state.anecdotes.concat(newAnecdote).toSorted((a, b) => b.votes - a.votes)
         })
      )
      useNotificationStore.getState().actions.setNotification(
        `You added anecdote: "${newAnecdote.content}"`
      )
      setTimeout(() => useNotificationStore.getState().actions.setNotification(
        null
      ), 5000)
    },
    vote: async (id) => {
      //const anecdote = useAnecdoteStore.getState().anecdotes.find(n => n.id === id)
      const anecdote = get().anecdotes.find(n => n.id === id)
      const updated = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(
        state => ({
          anecdotes: state.anecdotes.map(anecdote =>
            anecdote.id === id ? updated : anecdote
          ).toSorted((a, b) => b.votes - a.votes)
        })
      )
      useNotificationStore.getState().actions.setNotification(
        `You voted: "${updated.content}"`
      )
      setTimeout(() => useNotificationStore.getState().actions.setNotification(
        null
      ), 5000)
    },
    setFilter: value => set(() => ({ filter: value }))
  },
}))

export const useNotificationActions = () => useNotificationStore((state) => state.actions)
export const useNotification = () => useNotificationStore((state) => state.notification)

export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  if (filter) return anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
  return anecdotes
}
