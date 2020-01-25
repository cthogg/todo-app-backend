import express from 'express';
const app = express();
import cors from 'cors';
import 'dotenv/config';
import uuidv4 from 'uuid/v4';
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.post('/todos', (req, res) => {
  const id = uuidv4();
  const description = req.body.description;
  const message = {
    id,
    description
  };
  todos[id] = message;
  return res.send(message);
});
app.put('/todos/:todoId', (req, res) => {
  return res.send(
    `PUT HTTP method on todo/${req.params.todoId} resource`,
  );
});
app.delete('/todos/:todoId', (req, res) => {
  return res.send(
    `DELETE HTTP method on todo/${req.params.todoId} resource`,
  );
});
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);