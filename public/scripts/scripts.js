class ColorConstructor {
  function onloadProcesses() {
    this.setListeners()
    this.getProjects()
    this.findNewColor()
  }

  function setListeners() {
    function findOne(value) {
      return document.querySelector(value)
    }
    function findAll(value) {
      return document.querySelectorAll(value)
    }

    findOne('.generate').addEventListener('click', this.findNewColor)
    findOne('select').addEventListener('change', this.getPalettes)
    findAll('.lock').forEach(function (lock) {
      lock.addEventListener('click', this.toggleLock)
    })
    findAll('form').forEach(function (form) {
      form.addEventListener('submit', this.onSubmit)
    })
  }

  function hexGenerator() {
    const hexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
    let newHex = ['#']

    for(let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * Math.floor(hexValues.length))

      newHex.push(hexValues[index])
    }

    return newHex.join('')
  }

  function findNewColor(){
    const activeColors = document.querySelectorAll('.active')
    let newColors = [];

    for(let i = 0; i < activeColors.length; i++) {
      newColors.push(this.hexGenerator())
    }

    activeColors.forEach(function (color, i) {
      color.setAttribute('style', `background-color:${newColors[i]};`)
      if(!color.children[1]) {
        const text = document.createElement('p')
        color.append(text)
        text.innerText = newColors[i]
      } else {
        color.children[1].innerText = newColors[i]
      }
    })
  }

  function toggleLock(e) {
    const active = e.target.closest('div')
    e.target.classList.toggle('locked')
    active.classList.toggle('active')
  }

  async function getPalettes(e) {
    const value = e.target.value
    if(value === '') {
      return
    }
    const id = document.querySelector(`.${value}`).attributes.data.value
    const palettes = await this.serverSend(`/api/v1/projects/${id}/palettes`)

    this.removePaletteNodes()

    palettes.forEach(function (palette) {
      this.createPaletteDom(palette)
    })
  }

  funtion createPaletteDom (palette) {
    function create(value) { 
      return document.createElement(value)
    }
    const section = create('section')
    const h3 = create('h3')
    const footer = document.querySelector('footer')
    const colors = Object.keys(palette).filter(function(att) {
      return att.includes('hex')
    })
    const button = create('button')

    button.addEventListener('click', this.deletePalette)
    button.innerText = 'X'
    button.className = 'button'
    section.setAttribute('data', `${palette.id}`)
    h3.innerText = palette.name
    section.append(h3)
    section.className = 'palette'
    colors.forEach(function (color) {
      const div = create('div')
      div.setAttribute('style', `background-color: ${palette[color]};`)
      div.className = "palette-color"
      section.append(div)
    })
    section.append(button)
    footer.append(section)
  }

  function removePaletteNodes() {
    const footer = document.querySelector('footer')
    while(footer.firstElementChild) {
      footer.removeChild(footer.firstElementChild)
    }
  }

  async function deletePalette (e){
    
    function find (value) {
      return document.querySelector(value)
    }
    const section = e.target.closest('section')
    const projectId = find(`.${find('select').value}`).attributes.data.value
    const paletteId = section.attributes.data.value
    

    this.serverSend(`/api/v1/projects/${projectId}/palettes/${paletteId}`, {method: 'DELETE'})
    section.remove()
  }

  async function getProjects() {
    const projects = await this.serverSend('/api/v1/projects')
    const selectForm = document.querySelector('select')

    projects.forEach(function (project) {
      const option = document.createElement('option')

      option.innerText = project.name
      option.setAttribute('data', project.id)
      option.className = project.name
      selectForm.append(option)
    })
  }

  async function savePalette () {
    function findAll (value) {
      return document.querySelectorAll(value)
    }
    function find(value) {
      return document.querySelector(value)
    }
    const project = find('select').value
    const id = find(`.${project}`).attributes.data.value
    const url = `/api/v1/projects/${id}/palettes`
    const colors = findAll('.color')
    let palette = {
      name: find('.palette-name').value,
      method: 'POST'
    }
    const h3 = findAll('h3')

    if(palette.name === '') {
      return alert('Palettes must have a name')
    }
    for(let i = 0; i < h3.length; i++) {
      if(h3[i].innerText === palette.name) {
        return alert(`${palette.name} already exists`)
      }
    }

    for(let i = 0; i < colors.length; i++) {
      const hex = `hex_${i + 1}`
      palette[hex] = colors[i].innerText
    }

    const paletteId = await this.serverSend(url, palette)

    palette.id = paletteId.id
    this.createPaletteDom(palette)
  }

  async function saveProject () {
    const url = '/api/v1/projects'
    const project = document.querySelector('.new-project')
    const options = document.querySelectorAll('option')

    if(project.value === '') {
      return alert('Projects must have a name')
    }
    for(let i = 0; i < options.length; i++) {
      if(options[i].innerText === project.value) {
        return alert(`${project.value} already exists`)
      }
    }
    const selectForm = document.querySelector('select')
    const option = document.createElement('option')
    const returnId = await this.serverSend(url, {name:project.value, method: 'POST'})

    option.innerText = project.value
    option.className = project.value
    option.setAttribute('data', returnId.id)
    selectForm.appendChild(option)
    selectForm.value = project.value
    project.value = ''

    this.removePaletteNodes()
  }

  async function serverSend(url, data) {
    if(data !== '' && data) {
      const method = data.method
      delete data.method
      const options = {
          method,
          mode: "cors",
          credentials: "same-origin",
          headers: {
            'Accept': 'application/json',
            "Content-Type": 'application/json',
          },
          body: JSON.stringify(data),
        }
      const response = await fetch(url, options);
      const newData = await response.json();
      
      return newData
    } else {
      const response = await fetch(url)
      const newData = await response.json()

      return newData
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    if(e.target.className === 'project-form') {
      this.saveProject()
    } else {
      this.savePalette()
    }
  }
}

const colorConstructor = new ColorConstructor()

colorConstructor.onloadProcesses();



