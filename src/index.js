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

const binId = '5e396961f47af813bace8b68'
const secretKey = '$2b$10$ss6kyK17Nzbft.WFD/o.fe55Krc14gVmKOcXk6RxppiAURM7UZ75m'

const getLatestData = () =>  axios.get('https://api.jsonbin.io/e/5e396961f47af813bace8b68/versions',{  headers: {'secret-key': '$2b$10$ss6kyK17Nzbft.WFD/o.fe55Krc14gVmKOcXk6RxppiAURM7UZ75m'},
}).then(function(response){
  const versionNumber = response.data.versionCount
 return  axios.get(`https://api.jsonbin.io/b/5e396961f47af813bace8b68/${versionNumber}`,{  headers: {'secret-key': '$2b$10$ss6kyK17Nzbft.WFD/o.fe55Krc14gVmKOcXk6RxppiAURM7UZ75m'},
})})

app.get('/todos',checkJwt, (req, res) => {
 //TODO: request latest version from api
  const userId = req.user.sub
  getLatestData().then(function (response) {
  console.log('response data', response.data);
  return res.send(Object.values(response.data[userId]));
}).catch(function (error) {
  console.log(error);
})  
});
app.get('/todos/:todoId', checkJwt, (req, res) => {
  const userId = req.user.sub
  axios.get('https://api.jsonbin.io/b/5e396961f47af813bace8b68/1',{  headers: {'secret-key': '$2b$10$ss6kyK17Nzbft.WFD/o.fe55Krc14gVmKOcXk6RxppiAURM7UZ75m'},
})
  .then(function (response) {
    console.log('response', response.data);
    res.send(response.data[userId][req.params.todoId]);
  })
  .catch(function (error) {
    console.log(error);
  })  
});

//TODO: check for 201 
app.post('/todos', checkJwt, (req, res) => {
   //TODO: request latest version from 
  //TODO: get from URL
  //TODO: PUT the URL with new 
    const userId = req.user.sub
    var newTodos = response.data
  const {description,title, dueDate, id} = req.body;
  const message = {
    id,
    description,
    title,
    dueDate
    };  
    newTodos[userId][id] = message;

});
app.put('/todos/:todoId',checkJwt, (req, res) => {
   //TODO: request latest version from api

  //TODO: send out to the json bin.
   //TODO: get from URL
  //TODO: PUT the URL with new version
  const userId = req.user.sub
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
  const userId = req.user.sub
  const todoId = req.params.todoId
  var todo = {}
  getLatestData().then(function (response) {
    console.log('response data', response.data);
    var newData = response.data
    todo = newData[userId][todoId]
    delete newData[userId][todoId]
    //TODO: put this data into new one
    return   axios.put('https://api.jsonbin.io/b/5e396961f47af813bace8b68', newData, {  headers: {'secret-key': '$2b$10$ss6kyK17Nzbft.WFD/o.fe55Krc14gVmKOcXk6RxppiAURM7UZ75m'},
  })
  }).then(function(response){
    return res.send(todo);
  }).catch(function (error) {
    console.log(error);
  })
});
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);