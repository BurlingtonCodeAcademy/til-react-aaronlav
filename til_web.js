const assert = require('assert');
const FactStore = require('./lib/factStore')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const path = require('path')
const static = path.join(__dirname, "static")

app.use(express.static('static')) // static file server
app.use(express.urlencoded({ extended: true })) // all POST bodies are expected to be URL-encoded

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const store = new FactStore(dbUrl);

app.get('/facts/:objectId', getOne)

async function getOne(request, response) {
  let facts = await store.get(request.params.objectId)
  let output = [];
  facts.forEach((entry) => {
    output.push(entry);
  }, function (err) {
    assert.equal(null, err);
    console.log("Sending " + output.length + " records to client");
    response.type('application/json')
      .send(JSON.stringify(output))
  });
}


app.get('/factList', function (request, response) {
  response.sendFile(path.join(static, 'facts.html'))
});

app.get('/facts', getAll);

async function getAll(request, response) {
  let cursor = await store.all();
  let output = [];
  cursor.forEach((entry) => {
    output.push(entry);
  }, function (err) {
    assert.equal(null, err);
    console.log("Sending " + output.length + " records to client");
    response.type('application/json')
      .send(JSON.stringify(output))
  });
}

app.get('/:fact', function (request, response) {
  response.sendFile(path.join(static, 'fact.html'))
});

app.post('/facts', addFact);

async function addFact(request, response) {
  let result = await store.addFact(request.body.text.trim())
  let output = {
    status: 'ok',
    id: result.id
  }
  response
    .type('application/json')
    .send(JSON.stringify(output))
}

app.post('/deleted', deleteFact);
async function deleteFact(request, response) {
  let result = await store.deleteFact(request.body.text.trim())
  let output = {
    status: 'ok',
    id: result.id
  }
}

// app.delete('delete fact', deleteFact)
// async () => {
//   const result = await App.deleteFact(request.body.text.delete())
//   expect(result).toBe(1);

//   await App.deleteOne({id: result.id})
//   const newResult = await App.deleteFact();
//   expect(fact).toBe(0);
// }

app.listen(port, () => console.log(`TIL web app listening on port ${port}!`))
