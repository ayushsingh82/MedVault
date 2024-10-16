const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process'); // To run a Python script

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/extract', (req, res) => {
    const { text } = req.body;
    // Call your Python script here and return the result
    exec(`python extract.py "${text}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(error);
        }
        res.json({ data: stdout });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
