require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const app = express()

const Contact = require('./models/phonebook')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('sentData', (req) => JSON.stringify(req.body))
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :sentData')
app.use(logger)

app.get('/api/persons', (req, res) => {
  Contact.find({})
    .then(contacts => {
      res.json(contacts)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Contact.findById(id)
    .then(contact => {
      res.json(contact)
    })
    .catch(error => next(error))
})

app.get('/api/info/', (res) => {
  let phonebookLength = 'unknown'

  Contact.find({})
    .then(contacts => {
      phonebookLength = contacts.length
      const message = `
                <p>phonebook has info for ${phonebookLength} people</p>\n
                <p>${new Date(Date.now()).toString()}</p>`

      res.send(message)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {
  const data = req.body

  if(!data.name || !data.number){
    return res.status(400).json({
      error: 'malformed entry, missing content'
    })
  }

  const person = new Contact ({
    name: data.name,
    number: data.number,
  })

  person.save()
    .then(result => {
      res.json(result)
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id   = req.params.id
  const data = req.body

  if(!data.name || !data.number){
    return res.status(400).json({
      error: 'malformed entry, missing content'
    })
  }

  const newPerson = new Contact ({
    id:     id,
    name:   data.name,
    number: data.number,
  })

  newPerson.save()
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})

const errorHandler = (error, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError' && error?.errors?.name?.kind === 'minlength') {
    return res.status(400).send({ error: `the name '${error.errors.name.properties.value}' is shorter than the minimum allowed length of ${error.errors.name.properties.minlength})` })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`)
})
