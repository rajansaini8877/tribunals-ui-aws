const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fetchSimilar = require('./src/services/fetch-similar');
// const extractFileSummary = require('./src/utils/extract-file-summary');
// const extractTextSummary = require('./src/utils/extract-text-summary');
// const searchSimilar = require('./src/utils/search-similar');
// const answerQuery = require('./src/utils/answer-query');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files from the public directory
app.use(express.static('public'));

// Define a route

// app.post('/summarisation/text/result', async (req, res) => {
//   const input = req.body.data;
//   output = await extractTextSummary(input);
//   res.render('summary-text', {summary: output});
// });

// app.get('/summarisation/text', (req, res) => {
//     res.render('summarisation');
//   });

//   app.post('/summarisation/file/result', upload.single('data'), async (req, res) => {
//     const input = req.file;
//     console.log(input)
//     output = await extractFileSummary(input);
//     res.render('summary-file', {summary: output});
//   });
  
//   app.get('/summarisation/file', (req, res) => {
//       res.render('upload');
//     });

//   app.post('/search/results', async (req, res) => {
//     const input = req.body.data;
//     output = await searchSimilar(input);
//     res.render('results', {results: output});
//   });

//   app.get('/search', (req, res) => {
//     res.render('search');
//   });

//   app.post('/query/answer', async (req, res) => {
//     const input = req.body.data;
//     output = await answerQuery(input);
//     res.render('answer', {answer: output});
//   });

app.get('/health', (req, res) => {
  res.status(200).json({
    code: 200,
    message: "Healthy"
  });
})

app.post('/output', async (req, res) => {
  console.log(await fetchSimilar("judge of the First-tier Tribunal"));
  res.render('output')
})

app.post('/input', (req, res) => {
    res.render('input')
})

  app.get('/home', (req, res) => {
    res.render('home');
  });

  app.get('/', (req, res) => {
    res.redirect('/home');
  });

// start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});