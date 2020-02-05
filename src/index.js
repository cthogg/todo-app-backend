import express from 'express';
const app = express();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const axios = require('axios');
import cors from 'cors';
import 'dotenv/config';
import request from 'supertest'
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Set up Auth0 configuration
const authConfig = {
  //TODO: create new domain and audience
  domain: "dev-gzbfmeq4.eu.auth0.com",
  audience: "https://loggerman.com"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from dev-gzbfmeq4.eu.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});


let todos = {
    //TODO: make these user Ids somehow secret
    "google-oauth2|116227425365784020173":{

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
  }},
  "auth0|5e3962679c411f0e49a6b7aa":{
    124:{
      id: '124',
      description: 'Cleaning materials are in the cupboard. Philip',
      title: 'Clean Apartment',
      dueDate: '2020-02-02'
    }
}
};

app.get('/', checkJwt, (req, res) => {
  res.send('Hello World!');
});

app.get('/todos',checkJwt, (req, res) => {
  
     //TODO: get the username from the request
  // TODO: get the todos from the username.
  const userId = req.user.sub
  console.log('userId', userId);
  return res.send(Object.values(todos[userId]));
});
app.get('/todos/:todoId', checkJwt, (req, res) => {
    //TODO: get the username from the request
  // TODO: get the todos from the username.
  const userId = req.user.sub
  console.log('userId put', userId);
  return res.send(todos[userId][req.params.todoId]);
});

//TODO: check for 201 
app.post('/todos', checkJwt, (req, res) => {
  const userId = req.user.sub
  console.log('userId put', userId);
  //TODO: get the username from the request
  // TODO: post the todos from the username.
  const {description,title, dueDate, id} = req.body;
  const message = {
    id,
    description,
    title,
    dueDate
  };
      //TODO: return error or no description or title

  todos[userId][id] = message;
  return res.send(message);
});
app.put('/todos/:todoId',checkJwt, (req, res) => {
  const userId = req.user.sub
  console.log('userId put', userId);
    //TODO: get the username from the request
  // TODO: PUT the todos from the username.
  const todoId = req.params.todoId
  const {description,title, dueDate} = req.body;
  const message = {
    id: todoId,
    description,
    title,
    dueDate
  };
  //TODO: return error or no description or title
  todos[userId][todoId] = message
  return res.send(
   message
  );
});

app.delete('/todos/:todoId', checkJwt, (req, res) => {
        //TODO: get the username from the request
  // TODO: delete the todos from the username.
  const userId = req.user.sub
  console.log('userId delete', userId);
  const todoId = req.params.todoId
  const todo = todos[userId][todoId]
  delete todos[userId][todoId]
  return res.send(todo);
});
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);

//TODO: move this test to separate module
/* request(app)
  .get('/todos')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  }); */