import { useStats } from './store'

const Statistics = () => {
  const { good, neutral, bad } = useStats()

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{good + neutral + bad}</td></tr>
          <tr><td>average</td><td>{(good + neutral + bad) === 0 ? 0 : ((good + (bad * -1)) / (good + neutral + bad)).toFixed(1)}</td></tr>
          <tr><td>positive</td><td>{(good + neutral + bad) === 0 ? 0 : (100 * ((good) / (good + neutral + bad))).toFixed(1) }%</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
