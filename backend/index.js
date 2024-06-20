const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const words = ["apple", "brave", "crane", "drive", "eagle"];
const secretWord = words[Math.floor(Math.random() * words.length)];

app.post('/guess', (req, res) => {
    const { letter, position } = req.body;
    if (secretWord[position] === letter) {
        res.json({ status: "correct" });
    } else if (secretWord.includes(letter)) {
        res.json({ status: "present" });
    } else {
        res.json({ status: "absent" });
    }
});

// Serve static files from the react app
app.use(express.static(path.join(__dirname, 'public')));

// catchall handler for any request that doersn't match an API route, send back React's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
