const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const getMetric = require('./lib/getMetric');
const addMetric = require('./lib/addMetric');

app.use(bodyParser.json());

app.get('/metric/:key/sum', function (req, res) {
  const { key } = req.params;

  getMetric(key)
    .then(sum => { res.send(sum); })
    .catch(err => {
      var errStatus = err.status || 500
      var errMessage = err.message || 'Unable to retrieve metric'
      res.status(errStatus).send({ error: errMessage });
    });
});

app.post('/metric/:key', function (req, res) {
  const { key } = req.params;
  let { value } = req.body;

  value = typeof(value) === 'number' && value % 1 === 0 && value > 0 ? value : null;

  if (value) {
    addMetric({ key, value })
      .then(() => { res.sendStatus(200); })
      .catch(() => { res.status(500).send({ error: 'Error adding metric' }); });
  } else {
    res.status(400).send({ error: 'Metric value is invalid or undefined' });
  }
});

app.use((req, res) => {
  res.status(404).send({});
});

app.listen(port, () => console.log(`Server started on port ${port}`))
