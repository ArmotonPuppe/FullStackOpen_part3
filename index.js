const express = require('express')
const app = express()
const morgan = require('morgan')



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "5",
      "name": "Matti Mandoliino", 
      "number": "123123123"
    }
]
app.use(express.json())

morgan.token('content', getBody = (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan('tiny', {
    skip: function(req, res) {return req.method === 'POST'}
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content', {
    skip: function (req, res) {return req.method !== 'POST'}
}))


app.get('/', (request, response) => {
    console.log('get called')
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    request.requestDate = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                   <p>${request.requestDate}`)
})

app.get('/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) { 
        response.json(person)
    }else{ 
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }else if(persons.some(person => person.name === body.name)){
        return response.status(409).json({
            error: 'name is already in the phonebook'
        })
    }
    const newId = "" + Math.floor(Math.random() * persons.length * 1000)
    const person = {
        id: newId,
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    console.log("added person " + person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

console.log('Hello World')
const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})