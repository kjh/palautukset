import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useFilter, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('add appends a new anecdote', async () => {
    const newAnecdote = { id: 2, content: 'New anecdote', votes: 0 }
    anecdoteService.createNew.mockResolvedValue(newAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.add('New anecdote')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toContainEqual(newAnecdote)
  })

  it('vote adds a vote', async () => {
    const anecdote = { id: 1, content: 'Test', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.update.mockResolvedValue({ ...anecdote, votes: 1 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})

describe('AnecdoteList', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [] })
  })

  it('anecdote list is ordered correctly', () => {
    const anecdotes = [
      { id: 1, content: 'Vika', votes: 0 },
      { id: 2, content: 'Ylin', votes: 2 },
      { id: 3, content: 'Keski', votes: 1 }
    ]

    useAnecdoteStore.setState({ anecdotes })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    console.log('result', anecdotesResult.current)

    expect(anecdotesResult.current.map(anecdote => anecdote.content)).toEqual(['Ylin', 'Keski', 'Vika'])
  })

  it('anecdote list is filtered correctly', async () => {
    const anecdotes = [
      { id: 1, content: 'Vika', votes: 0 },
      { id: 2, content: 'Ylin', votes: 2 },
      { id: 3, content: 'Keski', votes: 1 }
    ]

    useAnecdoteStore.setState({ anecdotes })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.setFilter('k')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    console.log('result', anecdotesResult.current)

    expect(anecdotesResult.current.map(anecdote => anecdote.content)).toEqual(['Keski', 'Vika'])
  })
})