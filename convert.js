const fs = require('fs')
const raw = require('./data.json')
const result = []
console.log(raw)
for (let name in raw) {
  if (raw[name].progress == 0 && raw[name].shows === 10) {
    raw[name].shows = 0 
  }
}
//fs.writeFileSync('./data.json', JSON.stringify(raw))