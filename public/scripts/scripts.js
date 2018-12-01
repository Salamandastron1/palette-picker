class ColorConstructor {
  constructor() {
    this.state = {
      projects: []
    }
  }
  setListeners = () => {
    const generateButton = document.querySelector('.generate')
    const colorListener = generateButton.addEventListener('click', this.findNewColor)
    const locks = document.querySelectorAll('.lock')
    const lockListeners = locks.forEach(lock => {
      lock.addEventListener('click', this.toggleLock)
    })
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
}

const colorConstructor = new ColorConstructor()

colorConstructor.setListeners();



