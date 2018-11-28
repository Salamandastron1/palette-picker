const projectsData = [
  {name: 'poop', palettes:[
  {hex_1: 'red', hex_2: 'blue', hex_3: 'orange', hex_4: 'cerulean', hex_5: 'green'},
  {hex_1: 'red', hex_2: 'blue', hex_3: 'orange', hex_4: 'cerulean', hex_5: 'green'}
]},
  {name: 'meow', palettes: [
  {hex_1: 'red', hex_2: 'blue', hex_3: 'orange', hex_4: 'cerulean', hex_5: 'green'},
  {hex_1: 'red', hex_2: 'blue', hex_3: 'orange', hex_4: 'cerulean', hex_5: 'green'}
]},
  {name: 'project2', palettes: [
  {hex_1: 'red', hex_2: 'blue', hex_3: 'orange', hex_4: 'cerulean', hex_5: 'green'},
  {hex_1: 'red', hex_2: 'blue', hex_3: 'orange', hex_4: 'cerulean', hex_5: 'green'}
  ]}
];

const createPalette = (knex, palette) => {
  console.log(palette)
  return knex('palettes').insert(palette)
}

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name,
  }, 'id')
  .then(projectIds => {
    const palettePromises = project.palettes.map(palette => {
      return createPalette(knex, {
        ...palette,
        project_id: projectIds[0]
      })
    })

    return Promise.all(palettePromises)
  })
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      const projectPromises = projectsData.map(project => {
        return createProject(knex, project)
      })

      return Promise.all(projectPromises)
    })
    .then(() => console.log('successfully seeded'))
    .catch(error => console.log(`Error seeding db: ${error.message}`))
};
