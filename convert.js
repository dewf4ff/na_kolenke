const fs = require('fs')
const raw = require('./data.json')
const result = []
raw.forEach(it => {
  result.push({
    word: it['Слово'],
    translation: it['Перевод'],
    group: it['Тема']
  })
})
fs.writeFileSync('./src/words.json', JSON.stringify(result))