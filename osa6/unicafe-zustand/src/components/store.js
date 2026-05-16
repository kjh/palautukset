import { create } from 'zustand'

export const useStatsStore = create(set => ({
    stats: {
        good: 0,
        neutral: 0,
        bad: 0,
        average: 0,
        positive: 0,
    },
    actions: {
        incrementGood: () => set(state => ({ stats: { ...state.stats, good: state.stats.good + 1 }})),
        incrementNeutral: () => set(state => ({ stats: { ...state.stats, neutral: state.stats.neutral + 1 }})),
        incrementBad: () => set(state => ({ stats: { ...state.stats, bad: state.stats.bad + 1 }})),
    }
}))

// the hook functions that are used elsewhere in app
export const useStats = () => useStatsStore(state => state.stats)
export const useStatsControls = () => useStatsStore(state => state.actions)