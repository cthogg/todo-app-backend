import express from 'express';
const app = express();
import cors from 'cors';
import 'dotenv/config';
import request from 'supertest'
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let todos = {
  1: {
    id: '1',
    description: 'Semi Skimmed',
    title: 'Buy Milk',
    dueDate: '2020-01-20'
  },
  2: {
    id: '2',
    description: 'Ham and Cheese',
    title: 'Buy Pizza',
    dueDate: '2020-02-01'
  }, 3: {
    id: '3',
    description: 'At the launderette',
    title: 'Wash Clothes',
    dueDate: '2020-02-02'
  }, 4:{
    id: '4',
    description: 'Cleaning materials are in the cupboard',
    title: 'Clean Apartment',
    dueDate: '2020-02-02'
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
  const {description,title, dueDate, id} = req.body;
  const message = {
    id,
    description,
    title,
    dueDate
  };
      //TODO: return error or no description or title

  todos[id] = message;
  return res.send(message);
});
app.put('/todos/:todoId', (req, res) => {
  const todoId = req.params.todoId
  const {description,title, dueDate} = req.body;
  const message = {
    id: todoId,
    description,
    title,
    dueDate
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