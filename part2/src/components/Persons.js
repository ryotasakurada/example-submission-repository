import React from 'react'
import Person from "./Person";
import PersonService from "../services/persons";

const Persons = ({ persons, searchQuery, setPersons }) => {
  const handleDelete = (person) => {
    if (window.confirm(`delete ${person.name} ?`)) {
      PersonService.deleteRequest(person.id)
      setPersons(persons.filter(p => p.id !== person.id))
    }
  }

  return (
    <div>
    {persons.filter(p => !searchQuery || p.name.includes(searchQuery) || p.number.includes(searchQuery))
        .map(person => <Person key={person.name} person={person} handleDeleteFunc={handleDelete}/>)}
    </div>
  )
}

export default Persons
