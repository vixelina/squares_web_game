const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_OPTIONS}`;

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to database.'))
  .catch(err => console.error('Could not connect to database:', err));

const scoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/submit-score', async (req, res) => {
  const { username, score } = req.body;

  if (!username || score == undefined) {
    return res.status(400).send('Username and score are required');
  }

  try {
    const newScore = new Score({ username, score });
    await newScore.save();
    res.status(201).send({ message: 'Score saved successfully', score: newScore });
  } catch (err) {
    console.error('Error saving score:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/scores', async (req, res) => {
  const { sortBy, order } = req.query;
  let sortOptions = {};

  if (sortBy == 'username') {
    sortOptions.username = order == 'desc' ? -1 : 1;
  } else if (sortBy == 'score') {
    sortOptions.score = order == 'desc' ? -1 : 1;
  }

  try {
    const scores = await Score.find().sort(sortOptions);
    res.status(200).send(scores);
  } catch (err) {
    console.error('Error fetching scores:', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.DB_PORT;
app.listen(PORT);
