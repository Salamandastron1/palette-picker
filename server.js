const express = require('express')
//grabs the express package from node modules
const app = express()
//instantiates a usage of express middleware and assign it to app
const bodyParser = require('body-parser')
//imports body parser from node module and assigns it
const environment = process.env.NODE_ENV || 'development'
//set enviro var based on detected node environment; defaults to development
const config = require('./knexfile')[environment]
//sets variable which directs what DB the app should use
const database = require('knex')(config)
//here the database address is actually determined
app.use(express.static('public'))
//directs the app to serve materials from the public folder on page load at "/"
app.use(bodyParser.json())
//tells the app to use the bodyparser in order to decipher the request objects json data
app.set('port', process.env.PORT || 3000);
//tells app which port to listen on. variable depending on enviro

app.get('/api/v1/projects',(request, response) => {
//sets the end point for getting projects
  database('projects').select()
//searches db for projects table and grabs whole thing
    .then(projects => {
//resolves promise from select
      response.json(projects)
//uses response object's json method to send outgoing data to window as json
    })
    .catch(error => {
//resolves promise and runs if there is error in db
      response.status(500).json({error: error.message})
//send appropriate server failure code with the error message
    })
})

app.post('/api/v1/projects', (request, response) => {
//end point for posting new projects
  const project = request.body;
//data from the request object is parsed and saved
  if(!project) {
//condition, is project falsy then run
    return response.status(422).json({error: 'No project object provided'});
//if there was no project send error telling them to figure it out
  };
  for(let requiredParameter of ['name']) {
//iterates over the project object looking for the key of name
    if(!project[requiredParameter]) {
//condition asking if the key of name exists
      return response.status(422).json({
//send error status if name doesn't exist
        error: `Expected format: {name: <STRING>}. Missing the requiredParameter of ${requiredParameter}`
//modular error message
      });
    };
  };

  database('projects').insert(project, 'id')
//data is good, now looks in data base for projects. inserts new projects and ask db for a new id
    .then(projectIds => {
//resolves promise from insert
      response.status(201).json({id: projectIds[0]})
//received an array with 1 index of the new id. sends to window as json
    })
    .catch(error => {
//resolves promise on error
      response.status(500).json({error: error.message})
//sends server error message as json
    })
});

app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
//sends endpoint for posting projects. requires a variable number for project_id

  const id = request.params.project_id
//project_id is parsed from request string

  if(!id) {
//if it was not send then it sends back error not found as json
    return response.status(404).json('Project does not exist')

  }
  database('palettes').where('project_id', id).select()
//data is good looks in db. sql commands to filter for ids that match and sends them up to server
    .then(palettes => {
//resolves on good promise
      response.json(palettes)
//sends data as 400 and json
    })
    .catch(error => response.status(500).json({error: error.message}))
//resolves on bad promise. sends interal server error as json
})

app.post('/api/v1/projects/:project_id/palettes',(request, response) => {
//end point for posting palettes to specific projects using the variable project id
  const palette = request.body;
//parses content of request body and saves
  const { project_id } = request.params
//finds id from url string

  if(!palette) {
//bad data?
    return response.status(422).json({error: 'No palette object submitted'})
//send error non identifiable sequence as json
  }
  for(let requiredParameter of ['name', 'hex_1', 'hex_2', 'hex_3', 'hex_4', 'hex_5']) {
//iterates over palette object looking for correct keys
    if(!palette[requiredParameter]) {
//if keys are not found
      return response.status(422).json({error: `Expected format: {name: <STRING>, hex_1: <STRING>, hex_2: <STRING>, hex_3: <STRING>, hex_4: <STRING>, hex_5: <STRING>}. Missing the required parameter of ${requiredParameter}`})
//send error specifying structure of body content
    }
  }

  database('palettes').insert({...palette, project_id}, 'id')
//data good. check db. insert spread palettle object with url id, and send back a unqiue identifier 
    .then(paletteIds => {
//resolves promise on success
      response.status(201).json({id: paletteIds[0]})
//send status of posted with the new id for future use as json
    })
    .catch(error => {
//resovles promise on error 
      response.status(500).json({ error: error.message })
//send server error as json
    })
})

app.delete('/api/v1/projects/:project_id/palettes/:id', (request, response) => {
//api endpoint for deletion of palettes
  const { id } = request.params
//saves url string of id after palettes

  database('palettes').where('id', id).del()
//checks db to see if info exists. if so deletes
    .then(id => response.json({message: `Palette with id ${id} was deleted`}))
//resolves promise on success send message as json
    .catch(error => response.status(500).json({error: error.message}))
//resolves promise on failure, send error as json
})


app.listen(app.get('port'), () => {
//direct the entire app to listen for requests on the specified port 
  console.log(`app is running on ${app.get('port')}`);
//tells developer which port is running
});
