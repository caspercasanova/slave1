// random(1, 101)
module.exports = {
  random: (min, max) => Math.floor(Math.random() * (max - min)) + min,
}