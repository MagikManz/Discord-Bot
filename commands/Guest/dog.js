const request = require('request')

const getRandom = (num) => {
  return Math.floor(Math.random() * Math.floor(num))
}
const Command = {
  alias: ['doge', 'domge', 'doggo'],
  description: 'DOG COMMAND !!',
  func: ({ member, channel }) => {
    if (getRandom(2) === 1) {
      request('http://shibe.online/api/shibes?count=1', (err, res, _) => {
        if (err) return

        channel.send({ content: `OKAIY ${member}!`, files: JSON.parse(res.body) })
      })
    } else {
      request('https://dog.ceo/api/breed/husky/images/random', (err, res, _) => {
        if (err) return

        channel.send({ content: `OKAIY ${member}!`, files: [(JSON.parse(res.body)).message] })
      })
    }
  }
}

module.exports = Command
