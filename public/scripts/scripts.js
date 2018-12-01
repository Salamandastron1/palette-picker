const domFuncs = require('./DomFuncs')

class ColorConstructor {
  constructor() {
    this.state = {
      projects: []
    }
  }
  setListeners = () => {
    const generateButton = document.querySelector('.generate').addEventListener('click', this.findNewColor)
    const locksListeners = document.querySelectorAll('.lock').forEach(lock => {
      lock.addEventListener('click', this.toggleLock)
    })
    const projectListener = document.querySelector('.project-form').addEventListener('submit', this.saveProject)
    const paletteListener = document.querySelector('.palette-form').addEventListener('submit', this.savePalette)

    this.findNewColor()
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

  savePalette = (e) => {
    e.preventDefault()
  }

  saveProject = async (e) => {
    e.preventDefault()
    debugger
    const url = '/api/v1/projects'
    const project = document.querySelector('.new-project').value
    const selectForm = document.querySelector('select')
    const option = document.createElement('option')
    // const savedProject = await this.serverSend(url, project)
    option.innerText = 'meow'
    selectForm.appendChild(option)

  }

  serverSend = async (url, data) => {
    if(!data === '') {
      const response = await fetch(url)
      const newData = response.json()

      return newData
    } else {
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json;',
        },
        body: JSON.stringify(data)
      }
      const response = await fetch(url, data);
      const newData = await response.json();

      return newData
    }
  }
}

const colorConstructor = new ColorConstructor()

colorConstructor.setListeners();



