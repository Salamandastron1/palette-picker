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
  const { id } = request.params

  database('projects').where('id', id).select()
    .then(project => response.json(project))
    .catch(error => response.status(500).json({error: error.message}))
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

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

  database('projects').insert(project, 'id')
    .then(projectIds => {
      response.status(201).json({id: projectIds[0]})
    })
    .catch(error => {
      response.status(500).json({error: error.message})
    })
});

app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
  const id = request.params.project_id

  if(!id) {
    return response.status(404).json('Project does not exist')
  }

  database('palettes').where('project_id', id).select()
    .then(palettes => response.json(palettes))
    .catch(error => response.status(500).json({error: error.message}))
})

app.post('/api/v1/projects/:project_id/palettes',(request, response) => {
  const palette = request.body;
  const { project_id } = request.params

  if(!palette) {
    return response.status(422).json({error: 'No palette object submitted'})
  }
  for(let requiredParameter of ['name', 'hex_1', 'hex_2', 'hex_3', 'hex_4', 'hex_5']) {
    if(!palette[requiredParameter]) {
      return response.status(422).json({error: `Expected format: {name: <STRING>, hex_1: <STRING>, hex_2: <STRING>, hex_3: <STRING>, hex_4: <STRING>, hex_5: <STRING>}. Missing the required parameter of ${requiredParameter}`})
    }
  }

  database('palettes').insert({...palette, project_id}, 'id')
    .then(paletteIds => {
      response.status(201).json({id: paletteIds[0]})
    })
    .catch(error => {
      response.status(500).json({ error: error.message })
    })
})

app.delete('/api/v1/projects/:project_id/palettes/:id', (request, response) => {
  const { id } = request.params

  database('palettes').where('id', id).del()
    .then(id => response.json({message: `Palette with id ${id} was deleted`}))
    .catch(error => response.status(500).json({error: error.message}))
})


app.listen(3000, () => {
  console.log('app is running on 3000');
});
