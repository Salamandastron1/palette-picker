const colors = document.querySelectorAll('.color')
const changeColor = e => {
  console.log('I did it')
}
const clickEvent = colors.forEach(color => {
  color.addEventListener('click', changeColor)
})




