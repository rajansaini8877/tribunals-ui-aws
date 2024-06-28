const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const { fetchSimilarAct, fetchSimilarAppeal } = require('./src/services/fetch-similar');
const { generateAnswer, generateSummary, generateDecision } = require('./src/services/generate-answers');
const connectRedis = require('./src/config/redis');
const {flushCache} = require('./src/utils/manage-cache');
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

app.get('/utils/flush/cache', async(req, res) => {
  await flushCache();
  res.status(200).json({
    code: 200,
    message: "Healthy"
  });
})

app.post('/case/act/results', async (req, res) => {
  console.log(req.body);
  const results = await fetchSimilarAct(req.body.query);
  res.render('case-act-results', {
    results: results
  });
});

app.post('/history/response', async (req, res) => {
  console.log(req.body);
  const answer = await generateAnswer(req.body.key, req.body.query);
  res.render('history-response', {
    key: req.body.key,
    query: req.body.query,
    answer: answer
  });
});

app.post('/history/home', async (req, res) => {
  console.log(req.body);
  const summary = await generateSummary(req.body.key);
  const decision = await generateDecision(req.body.key);
  res.render('history-home', {
    key: req.body.key,
    summary: summary,
    decision: decision
  });
})

app.post('/case/home', async (req, res) => {
  console.log(req.body);
  console.log(req.body.firstName);
  const query = `Claim: ${req.body.claim}\nEvidences: ${req.body.evidences}`;
  const similarAppeals = await fetchSimilarAppeal(query);
  console.log(similarAppeals);
  for(const item of similarAppeals) {
    item['summary'] = await generateSummary(item.key);
    item['decision'] = await generateDecision(item.key);
  }
  console.log(similarAppeals);
  res.render('case-home', {
    input: req.body,
    appeals: similarAppeals
  });
})

app.post('/form', (req, res) => {
    res.render('form')
})

  app.get('/home', async (req, res) => {
    await connectRedis();
    res.render('home');
  });

  app.get('/', (req, res) => {
    res.redirect('/home');
  });

// start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});