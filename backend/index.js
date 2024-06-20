const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
