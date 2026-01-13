import { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = ({ person, confirmDeletionOf }) => {
  return (
    <>
      <div key={person.name}>{person.name} {person.number}
        <button onClick={confirmDeletionOf}>delete</button></div>
    </>
  )
}

const Persons = ({ personsToShow, confirmDeletionOf }) => {
  console.log(JSON.stringify(personsToShow))
  return (
    <>
      {personsToShow.map((person) => <Person
        key={person.name}
        person={person}
        confirmDeletionOf={() => confirmDeletionOf(person.id, person.name)} />
      )}
    </>
  )
}

const PersonForm = ({ newName, newNumber, addPerson, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input
          value={newName}
          onChange={handleNameChange}
        /> <br />
        number: <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <>
      filter shown with: <input
        value={filter}
        onChange={handleFilterChange}
      /> <br />
    </>
  )
}

const Notification = ({ message: {message, type} }) => {
  console.log(message)
  console.log(type)
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({message: null, type: null})
  console.log(notificationMessage)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  //if (!persons) {
    //return null
  //}

  console.log('render')
  const personsToShow = (filter === '') ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber
    }
    const updatePerson = persons.find(person => person.name === newName)
    if (updatePerson) {
      //alert(`${newName} is already added to phonebook`)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(updatePerson.id, personObject)
          .then(returnedPerson => {
            setNotificationMessage({
            message: `Updated '${returnedPerson.name}' number`,
            type: "success"
          })
          setTimeout(() => {
            setNotificationMessage({message: null, type: null})
          }, 5000)
            setPersons(persons.map(person => person.id !== updatePerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })

      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setNotificationMessage({
            message: `Added '${returnedPerson.name}'`,
            type: "success"
          })
          setTimeout(() => {
            setNotificationMessage({message: null, type: null})
          }, 5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const confirmDeletionOf = (id, name) => {
    console.log('deletion of ' + id + ' needs to be confirmed')
    if (window.confirm(`Delete ${name}?`)) {
      console.log('yes')
      personService
        .deletePerson(id).then(deletedPerson => {
          setNotificationMessage({
            message: `Deleted '${deletedPerson.name}'`,
            type: "success"
          })
          setTimeout(() => {
            setNotificationMessage({message: null, type: null})
          }, 5000)
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        })
        .catch(error => {
          /*alert(
            `the person '${name}' was already deleted from server`
          )*/
          setNotificationMessage({
            message: `Information of '${name}' has already been removed from server`,
            type: "error"
          })
          setTimeout(() => {
            setNotificationMessage({message: null, type: null})
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
    } else {
      console.log('no')
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h1>Numbers</h1>
      <Persons personsToShow={personsToShow} confirmDeletionOf={confirmDeletionOf} />
    </div>
  )

}

export default App