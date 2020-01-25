import express from 'express';
const app = express();
import cors from 'cors';
import 'dotenv/config';
import uuidv4 from 'uuid/v4';
import request from 'supertest'
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//TODO: add title as well
let todos = {
  1: {
    id: '1',
    description: 'John Lennon',
  },
  2: {
    id: '2',
    description: 'Dave Davids',
  },
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/todos', (req, res) => {
  return res.send(Object.values(todos));
});
app.get('/todos/:todoId', (req, res) => {
  return res.send(todos[req.params.todoId]);
});

//TODO: check for 201 
app.post('/todos', (req, res) => {
  const id = uuidv4();
  const description = req.body.description;
  const message = {
    id,
    description
  };
      //TODO: return error or no description or title

  todos[id] = message;
  return res.send(message);
});
app.put('/todos/:todoId', (req, res) => {
  const todoId = req.params.todoId
  const description = req.body.description;
  const message = {
    id: todoId,
    description
  };
  //TODO: return error or no description or title
  todos[todoId] = message
  return res.send(
   message
  );
});

app.delete('/todos/:todoId', (req, res) => {
  const todoId = req.params.todoId
  const todo = todos[todoId]
  delete todos[todoId]
  return res.send(todo);
});
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);

//TODO: move this test to separate module
request(app)
  .get('/todos')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });
  request(app)
  .post('/todos')
  .send({description: 'john'})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });