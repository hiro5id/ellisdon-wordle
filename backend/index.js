const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const words = ["apple", "brave", "crane", "drive", "eagle"];
const userWords = {};

// Endpoint to get a new secret word
app.get('/ellisdonwordle/new-word', (req, res) => {
    const userId = uuidv4();
    const secretWord = words[Math.floor(Math.random() * words.length)];
    userWords[userId] = secretWord;
    res.json({ userId, message: 'New secret word chosen' });
    console.log(`current words: ${JSON.stringify(userWords,null,2)}`)
});


app.post('/ellisdonwordle/guess', (req, res) => {
    const { myUserId, letter, position } = req.body;
    const secretWord = userWords[myUserId];

    if (!secretWord) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

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
app.use('/ellisdonwordle', express.static(path.join(__dirname, 'public')));

// catchall handler for any request that doersn't match an API route, send back React's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.get('/ellisdonwordle/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
