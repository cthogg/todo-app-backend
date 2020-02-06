import express from 'express';
const app = express();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const axios = require('axios');
import cors from 'cors';
import 'dotenv/config';
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Set up Auth0 configuration
const authConfig = {
  //TODO: create new domain and audience
  //TODO: set these as env variables
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

app.get('/', checkJwt, (req, res) => {
  res.send('Hello World!');
});
//TODO: set these as env variables
const binId = '5e396961f47af813bace8b68'
const binRouteExperimental = `https://api.jsonbin.io/e/${binId}`
const binRouteBase = `https://api.jsonbin.io/b/${binId}`
//TODO: create a mock
//TODO: add spinners to the application due to the slow load speeds. 
const getLatestData = () =>  axios.get(`${binRouteExperimental}/versions`
).then(function(response){
  const versionNumber = response.data.versionCount
 return  axios.get(`${binRouteBase}/${versionNumber}`)})

app.get('/todos',checkJwt, (req, res) => {
  const userId = req.user.sub
  getLatestData().then(function (response) {
  return res.send(Object.values(response.data[userId]));
}).catch(function (error) {
  console.log(error);
})  
});

//TODO: check for 201 
app.post('/todos', checkJwt, (req, res) => {
  const userId = req.user.sub
  const todoId = req.params.todoId
  const {description,title, dueDate, id} = req.body;
  const message = {
    id,
    description,
    title,
    dueDate
    };  
  var todo = {}
  getLatestData().then(function (response) {
    var newTodos = response.data
    newTodos[userId][id] = message;    
    todo = newTodos[userId][todoId]
    return   axios.put(binRouteBase, newTodos)
  }).then(function(response){
    return res.send(todo);
  }).catch(function (error) {
    console.log(error);
  })

});
app.put('/todos/:todoId',checkJwt, (req, res) => {
    const userId = req.user.sub
  const todoId = req.params.todoId
  const {description,title, dueDate} = req.body;
  const message = {
    id: todoId,
    description,
    title,
    dueDate
  };
  getLatestData().then(function (response) {
    var newTodos = response.data
    newTodos[userId][todoId] = message
    return   axios.put(binRouteBase, newTodos)
  }).then(function(response){
    return res.send(
      message
     );
  }).catch(function (error) {
    console.log(error);
  })
  
});

app.delete('/todos/:todoId', checkJwt, (req, res) => {
  const userId = req.user.sub
  const todoId = req.params.todoId
  var todo = {}
  getLatestData().then(function (response) {
    var newData = response.data
    todo = newData[userId][todoId]
    delete newData[userId][todoId]
    return   axios.put(binRouteBase, newData)
  }).then(function(response){
    return res.send(todo);
  }).catch(function (error) {
    console.log(error);
  })
});
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);