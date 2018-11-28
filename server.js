const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const database = require('knex')(config)

app.use(express.static('public'))
app.use(bodyParser.json())
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects',(request, response) => {
  database('projects').select()
    .then(projects => {
      response.json(projects)
    })
    .catch(error => {
      response.status(500).json({error: error.message})
    })
})

app.get('/api/v1/projects/:id', (request, response) => {
  const requestId = parseInt(request.params.id)
  const foundProject = app.locals.projects.find(project => project.id === requestId)

  return response.json(foundProject)
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  const id = uuidv4();
  const newProject = {id, ...project}

  if(!project) {
    return response.status(422).json({error: 'No project object provided'});
  };
  for(let requiredParameter of ['name']) {
    if(!project[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: {name: <STRING>}. Missing the requiredParameter of ${requiredParameter}`
      });
    };
  };

  app.locals.projects.push(newProject);

  return response.status(201).json(newProject);
});

app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
  const requestId = parseInt(request.params.id)
  const foundPalettes = app.locals.palettes.find(palette => requestId === palette.id)

  return response.json(foundPalettes)
})

app.post('/api/v1/projects/:project_id/palettes',(request, response) => {
  const palette = request.body;
  const projectId = parseInt(request.params.id)
  const id = uuidv4();
  const newPalette = {id, projectId, ...palette}

  if(!palette) {
    return response.status(422).json({error: 'No palette object submitted'})
  }
  for(let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if(!project[requiredParameter]) {
      return response.status(422).json({error: `Expected format: {name: <STRING>, color1: <STRING>, color2: <STRING>, color3: <STRING>, color4: <STRING>, color5: <STRING>}. Missing the required parameter of ${requiredParameter}`})
    }
  }

  app.locals.palettes.push(newPalette)

  return response.status(201).json(newPalette)
})


app.listen(3000, () => {
  console.log('app is running on 3000');
});
