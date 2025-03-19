const express = require('express');
const app = express();

let phonebook = [
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
    }
];

app.get('/api/persons', (req, res) => {
    res.json(phonebook);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = phonebook.find((p) => p.id === id);

    if(!person) res.status(404).end();
    res.json(person);
});

app.get('/info', (req, res) => {
    const message = `
    <p>phonebook has info for ${phonebook?.length} people</p>\n
    <p>${new Date(Date.now()).toString()}</p>`;

    res.send(message);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});
