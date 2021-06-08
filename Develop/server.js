const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length;
    const newNote = req.body;
    notes.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify(notes, null, 2)
    );
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const deleteIndex = req.params.id;
    notes.splice(deleteIndex, 1);
    for (let i = 0; i < notes.length; i++) {
        console.log(notes[i]);
        notes[i].id = i;
        console.log(notes[i]);
    }

    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify(notes, null, 2)
    );
    res.json(req.body);
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log('API server now on port ${PORT}!');
});