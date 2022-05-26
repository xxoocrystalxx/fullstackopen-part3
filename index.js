require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.use(morgan("tiny"))
app.get("/api/persons", (request, response) => {
  Person.find({}).then((p) => {
    response.json(p)
  })
})

app.get("/info", (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length}  people</p><p>${date}</p>`
  )
})

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((p) => {
      response.json(p)
    })
    .catch((error) => {
      response.status(404).end()
    })
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 100000)
}

morgan.token("custom", function (req, res) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :custom"
  )
)
app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    })
  }

  // if (persons.find((p) => p.name === body.name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedperson) => {
    response.json(person)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
