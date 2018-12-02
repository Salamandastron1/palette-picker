class ColorConstructor {
  constructor() {
    this.state = {
      projects: []
    }
  }
  onloadProcesses = () => {
    this.setListeners()
    this.getProjects()
    this.findNewColor()
  }

  setListeners = () => {
    const generateButton = document.querySelector('.generate').addEventListener('click', this.findNewColor)
    const locksListeners = document.querySelectorAll('.lock').forEach(lock => {
      lock.addEventListener('click', this.toggleLock)
    })
    const projectListener = document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', this.onSubmit)
    })
    const select = document.querySelector('select').addEventListener('change', this.getPalettes)
  }

  hexGenerator = () => {
    const hexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
    let newHex = ['#']

    for(let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * Math.floor(hexValues.length))

      newHex.push(hexValues[index])
    }

    return newHex.join('')
  }

  findNewColor = () => {
    const activeColors = document.querySelectorAll('.active')
    let newColors = [];

    for(let i = 0; i < activeColors.length; i++) {
      newColors.push(this.hexGenerator())
    }

    activeColors.forEach((color, i) => {
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

  toggleLock = (e) => {
    const active = e.target.closest('div')
    e.target.classList.toggle('locked')
    active.classList.toggle('active')
  }

  getPalettes = async (e) => {
    const value = e.target.value
    const id = document.querySelector(`.${value}`).attributes.data.value
    const palettes = await this.serverSend(`/api/v1/projects/${id}/palettes`)

    this.deletePalettes()

    palettes.forEach(palette => {
      this.createPaletteDom(palette)
    })
  }

  createPaletteDom = palette => {
    const section = document.createElement('section')
    const h3 = document.createElement('h3')
    const footer = document.querySelector('footer')
    const colors = Object.keys(palette).filter(att => {
      return att.includes('hex')
    })

    section.setAttribute('data', `${palette.id}`)
    h3.innerText = palette.name
    section.append(h3)
    section.className = 'palette'
    colors.forEach(color => {
      const div = document.createElement('div')
      div.setAttribute('style', `background-color: ${palette[color]};`)
      div.className = "palette-color"
      section.append(div)
    })
    footer.append(section)
  }

  deletePalettes = () => {
    const footer = document.querySelector('footer')
    while(footer.firstElementChild) {
      footer.removeChild(footer.firstElementChild)
    }
  }

  getProjects = async () => {
    const projects = await this.serverSend('/api/v1/projects')
    const selectForm = document.querySelector('select')

    projects.forEach(project => {
      const option = document.createElement('option')

      option.innerText = project.name
      option.setAttribute('data', project.id)
      option.className = project.name
      selectForm.append(option)
    })
  }

  savePalette = async () => {
    const project = document.querySelector('select').value
    const id = document.querySelector(`.${project}`).attributes.data.value
    const url = `/api/v1/projects/${id}/palettes`
    const colors = document.querySelectorAll('.color')
    let palette = {
      name: document.querySelector('.palette-name').value
    }

    for(let i = 0; i < colors.length; i++) {
      const hex = `hex_${i + 1}`
      palette[hex] = colors[i].innerText
    }

    const paletteId = await this.serverSend(url, palette)

    palette.id = paletteId

    this.createPaletteDom(palette)
  }

  saveProject = async () => {
    const url = '/api/v1/projects'
    const project = document.querySelector('.new-project')

    if(project.value === '') {
      return alert('Projects must have a name')
    }
    const selectForm = document.querySelector('select')
    const option = document.createElement('option')
    const returnId = await this.serverSend(url, {name:project.value})

    option.innerText = project.value
    project.value = ''
    option.setAttribute('data', returnId.id)
    selectForm.appendChild(option)
  }

  serverSend = async (url, data) => {
    if(data !== '' && data) {
      const options = {
          method: 'POST',
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

  onSubmit = e => {
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



