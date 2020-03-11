const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 4000;
const app = express();
let savedNotes = require('./db/db.json');

// Serves static files
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const output_dir = path.resolve(__dirname, "public");

// Function to write notes to db.json
function writeNotes() {
    fs.writeFileSync('db/db.json', JSON.stringify(savedNotes), function (err) {
        if (err) {
            return err;
        }

    });
};

// Routes============================================================================

// Gets homepage
app.get('/', function (req, res) {
    res.sendFile(path.join(output_dir, 'index.html'));
});

// Gets notes page
app.get('/notes', function (req, res) {
    res.sendFile(path.join(output_dir, 'notes.html'));
});

// Displays all notes in json
app.get('/api/notes', function (req, res) {
    return res.json(savedNotes);
});

// Posts created notes to /api/notes; writes new notes to db.json
app.post('/api/notes', function (req, res) {
    var note = req.body;
    // Gives note a unique id
    note.id = note.title.replace(/\s+/g, "").toLowerCase();
    console.log(note);

    savedNotes.push(note);

    writeNotes();

    return res.json(savedNotes);
});

// Deletes note based on id, rewrites db.json w updated notes
app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;
    console.log(id);

    for (var i = 0; i < savedNotes.length; i++) {
        if (savedNotes[i].id === id) {
            savedNotes.splice(i, 1);
            writeNotes();
            return res.json(savedNotes);
        }
    };
});

// Create listener on port 3000
app.listen(PORT, function () {
    console.log('APP is listening at http://localhost:' + PORT);
});
