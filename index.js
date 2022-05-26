require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

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

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((p) => {
      if (p) response.json(p)
      else response.status(404).end()
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

morgan.token("custom", function (req, res) {
  return JSON.stringify(req.body)
})
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :custom"
  )
)
app.post("/api/persons", (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedperson) => {
    response.json(person)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
