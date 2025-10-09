import { useState } from 'react'

const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td><Display value={text} /></td><td><Display value={value} /></td>
    </tr>
  )
} 

const Statistics = ({ good, neutral, bad }) => {
  return (
    <>
      <h1>statistics</h1>
      {(good + neutral + bad) > 0 ? (
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={(good + neutral + bad)} />
            <StatisticLine text="average" value={((good + (bad * -1)) / (good + neutral + bad)).toFixed(1)} />
            <StatisticLine text="positive" value={(100 * ((good) / (good + neutral + bad))).toFixed(1) + " %"} />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App