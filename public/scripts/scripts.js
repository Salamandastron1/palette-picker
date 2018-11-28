const colors = document.querySelectorAll('.color')
const changeColor = colors.forEach(color => {
  color.addEventListener('click', changeColor)
})

function changeColor () {
  const newColors = findNewColor()
  console.log(newColors)
}

function hexGenerator () {
  const hexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  let newHex = ['#']

  for(let i = 0; i < 5; i++) {
    const index = Math.floor(Math.random() * Math.floor(hexValues.length))

    newHex.push(hexValues[index])
  }
  return newHex.join('')
}

function findNewColor() {
  const activeColors = document.querySelectorAll('active')
  let newColors = [];

  for(let i = 1; i < activeColors.length; i++) {
    newColors.push(hexGenerator())
  }
  return newColors
}

