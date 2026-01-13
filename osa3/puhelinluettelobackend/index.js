const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

morgan.token('json_body', req => JSON.stringify(req.body));

app.use(morgan(`${morgan['tiny']} :json_body`))

let persons = []

//app.get('/', (request, response) => {
//  response.send('<h1>Hello World!</h1>')
//})

app.get('/info', (request, response) => {
  response.send(`<p>${new Date}</p><p>Phonebook has info for ${persons.length} people</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return String(Math.floor(Math.random() * 1_000_000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(409).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})