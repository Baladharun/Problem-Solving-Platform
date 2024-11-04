const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getTestData } = require('./compiler.js');
const { addTextToImage, mailCertificate } = require('./certificate.js');
const { MongoClient } = require('mongodb');
const {mongoose} = require('mongoose');
mongoose.connect('mongodb://localhost:27017/problem_solving_test', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  emailId:String,
  user: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'problem_solving_test';
let db;
var questionData;
var questionNo;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }
}

connectToDatabase();

app.post('/run', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const { code, language,questionNo} = req.body;
    console.log(questionNo);
    const results = await getTestData(language, code, 3, db, questionNo);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.post('/submit', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  try {
    const { code, language,questionNo} = req.body;
    const results = await getTestData(language, code, questionData[questionNo - 1].testInputs.length, db, questionNo);
    res.status(200).json(results);
  } 
  catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.get('/', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  questionNumber = parseInt(req.query.no, 10) || 1;
  try {
    questionData = await db.collection('question_set').find().toArray();
    
    if (questionNumber > 0 && questionNumber <= questionData.length) {
      res.json(questionData[questionNumber - 1]); 
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    console.error('Error retrieving question:', error);
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
});

app.post('/generate-certificate', async (req, res) => {
  const { username, mailId,decision} = req.body;

  try {
    if(decision>=1){
      await addTextToImage('./PROBLEM SOLVING.png', username, mailId,decision);
      res.send('Certificate generated');
    }
    else{
      mailCertificate(username,mailId,true);
    }
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).send('Error generating certificate');
  }
});

app.listen(5174, () => {
  console.log('Server running on http://localhost:5174');
});

app.post('/verify-login', async (req, res) => {
  try {
    console.log(req.body)
    const user = await User.findOne({ emailId: req.body.emailId, password: req.body.password });
    if (user) {
      res.status(200).json({ success: true, message: 'login-success' });
    } else {
      console.log('nothing')
      res.status(401).json({ success: false, message: 'unauthorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'server-error' });
  }
});
app.post('/signup',async (req,res)=>{
  try{
    console.log(req.body);
    const newUser = new User({
      emailId:req.body.emailId,
      user: req.body.username,
      password: req.body.password
    });
    
    newUser.save()
      .then((doc) => {
        console.log('Document inserted:', doc);
        res.status(200).send('login-success')
      })
      .catch((err) => {
        console.error('Error inserting document:', err);
      });
    
  }
  catch(error){
    console.log(error)
  }
})

