const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use(express.static('public'))

app.locals.projects = [];

app.get('/api/v1/projects', (request, response) => {
  
})

app.get('/api/v1/projects/:id', (request, response) => {

})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  const id = app.locals.projects[app.locals.projects.length - 1].id + 1;

  if(!project) {
    return response.status(422).json({error: 'No project object provided'})
  }
  for(let requiredParameter in ['name'] {
    if(project[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: {name: <STRING>}. Missing the requiredParameter of ${requiredParameter}`
      })
    }
  }) 
})