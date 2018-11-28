const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const uuidv4 = require('uuid/v4')

app.use(express.static('public'))
app.use(bodyParser.json())
app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette Picker'
app.locals.projects = [];

app.get('/api/v1/projects',(request, response) => {
  const projects = app.locals.projects.map(project => project.name)

  return response.json(projects)
})

app.get('/api/v1/projects/:id', (request, response) => {
  const requestId = parseInt(request.params.id)
  const foundProject = app.locals.project.find(project => project.id === requestId)
  return response.json(foundProject)
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  const id = uuidv4()

  if(!project) {
    return response.status(422).json({error: 'No project object provided'});
  };
  for(let requiredParameter in ['name']) {
    if(project[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: {name: <STRING>}. Missing the requiredParameter of ${requiredParameter}`
      });
    };
  };

  app.locals.projects.push({id, ...project});

  return response.status(201).json({id, ...project});
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`);
});
