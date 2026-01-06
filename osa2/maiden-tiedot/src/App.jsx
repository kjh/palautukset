import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {

    console.log('fetching countries...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })

  }, [])

  const countriesToShow = (value === '') ? [] : countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase()))

  useEffect(() => { 
    if (countriesToShow.length === 1) { 
      const [lat, lng] = countriesToShow[0].capitalInfo.latlng
      console.log(`fetching weather data lat:${lat} lng:${lng}...`)
      axios
        .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true` )
          .then(response => { 
            setWeather(response.data.current_weather)
          })
    } 
  }, [value])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const weatherIcons = {
    day: {
      0: "☀️",   // Clear sky
      1: "🌤️",   // Mainly clear
      2: "⛅",   // Partly cloudy
      3: "☁️",   // Overcast
      45: "🌫️",  // Fog
      48: "🌫️",
      51: "🌦️",  // Drizzle
      53: "🌦️",
      55: "🌦️",
      61: "🌧️",  // Rain
      63: "🌧️",
      65: "🌧️",
      71: "❄️",  // Snow
      73: "❄️",
      75: "❄️",
      80: "🌧️",  // Rain showers
      81: "🌧️",
      82: "🌧️",
      95: "⛈️",  // Thunderstorm
      96: "⛈️",
      99: "⛈️"
    },

    night: {
      0: "🌕",  // Clear night
      1: "🌖",  // Mostly clear night
      2: "🌥️",  // Partly cloudy night
      3: "☁️",  // Overcast (same)
      45: "🌫️", // Fog
      48: "🌫️",
      51: "🌧️", // Drizzle (same)
      53: "🌧️",
      55: "🌧️",
      61: "🌧️", // Rain
      63: "🌧️",
      65: "🌧️",
      71: "❄️", // Snow
      73: "❄️",
      75: "❄️",
      80: "🌧️", // Rain showers
      81: "🌧️",
      82: "🌧️",
      95: "⛈️", // Thunderstorm
      96: "⛈️",
      99: "⛈️"
    }
  }

  const showSearchResults = () => {
    if (countriesToShow.length > 10)
      return <pre>Too many matches, specify another filter</pre>

    if (countriesToShow.length > 1) 
      return (<ul>
          {countriesToShow.map(country => (
            <li key={country.name.common}>{country.name.common} <button onClick={()=>setValue(country.name.common)}>Show</button></li>
          ))}
        </ul>)

    if (countriesToShow.length == 1)
      return (
        <div>
          <h1>{countriesToShow[0].name.common}</h1>
          <p>Capital {countriesToShow[0].capital}<br />
          Area {countriesToShow[0].area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(countriesToShow[0].languages).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={countriesToShow[0].flags.png} width="200" />
          <h2>Waether in {countriesToShow[0].capital}</h2>
          {weather &&
            <div>
              <p>
                Temperature {weather.temperature}°C
              </p>
              <div style={{ fontSize: "5rem" }}>
                {weather.is_day ? weatherIcons.day[weather.weathercode] : weatherIcons.night[weather.weathercode]}
              </div>
              <p>
                Wind: {Math.round(weather.windspeed / 3.6)} ms/s
              </p>
            </div>
          }
        </div>
      )
    return null
  }

  return (
    <div>
      find countries: <input value={value} onChange={handleChange} />
      {showSearchResults()}
    </div>
  )
}

export default App