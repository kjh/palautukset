import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, update } from '../requests'
//import { useContext } from 'react'
//import NotificationContext from '../NotificationContext'
import useNotify from './useNotify'
export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { setNotification } = useNotify()//useContext(NotificationContext)

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: () => {
      setNotification('too short anecdote, must have length 5 or more')

      setTimeout(() => setNotification(
        null
      ), 5000)
    }
  })
  const voteMutation = useMutation({
    mutationFn: ({ id, anecdote }) => update(id, anecdote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
    vote: (anecdote) => voteMutation.mutate({
      ...anecdote, votes: anecdote.votes + 1
    }),
    handleVote: (anecdote) => voteMutation.mutate({
      id: anecdote.id,
      anecdote: { ...anecdote, votes: anecdote.votes + 1 }
    }),
  }
}