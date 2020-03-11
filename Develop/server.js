const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 4000;
const app = express();
let savedNotes = require('./db/db.json');


// serves static files
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const output_dir = path.resolve(__dirname, "public");

// Routes============================================================================


app.get('/', function (req, res) {
    res.sendFile(path.join(output_dir, 'index.html'));
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(output_dir, 'notes.html'));
});


app.get('/api/notes', function (req, res) {
    return res.json(savedNotes);

});


function writeNotes() {
    fs.writeFileSync('db/db.json', JSON.stringify(savedNotes), function (err) {
        if (err) {
            return err;
        }
        console.log('note saved!');

    });
}

app.post('/api/notes', function (req, res) {
    var note = req.body;
    note.id = note.title.replace(/\s+/g, "").toLowerCase();
    console.log(note);

    savedNotes.push(note);

    writeNotes();

    return res.json(savedNotes);
});

app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;
    console.log(id);

    for (var i = 0; i < savedNotes.length; i++) {
        if (savedNotes[i].id === id) {
            console.log(savedNotes[i].id)
            console.log(savedNotes[i])
            savedNotes.splice(i, 1);
            writeNotes();
            return res.json(savedNotes);

        }
        
    }


})




// In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
















// Create listener on port 3000
app.listen(PORT, function () {
    console.log('APP is listening at http://localhost:' + PORT);
})