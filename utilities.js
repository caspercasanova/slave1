const axios = require('axios')

module.exports = {
  // random(1, 101)
  random: (min, max) => Math.floor(Math.random() * (max - min)) + min,
  redditPickUpLines: async () => {
    let {data} =  await axios.get('https://www.reddit.com/r/pickuplines.json')
    let posts = data.data.children
    
    let pickUpLinesList = posts.map((post) => {
      let pickUpLine = ''
      pickUpLine += post.data.title
      pickUpLine += ` ${post.data.selftext}`
      return pickUpLine
    })
    let redditLines = pickUpLinesList.slice(1)
    
    let extraLines = [
      'is it pronounced .jif or .gif',
      'What did the bot say to the girl?',
      'I’m the droid you’re looking for.',
      'You make my interface GUI',
      '¿ gOt a RoBoT kInK ?',
      'Skiddy Beep Bop',
      'Want to grab some Java?',
      'ERROR ERROR: cAnNot ComPuTe bEaUty',
      'my homie r2d2 thinks u cute',
    ];
    // console.log([...extraLines, ...redditLines])
    return [...extraLines, ...redditLines]
  }
  
  
}

