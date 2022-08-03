import words from "../words.json"
class Storage {
  getWords() {
    const rawData = localStorage.getItem('words')
    if (!rawData) {
      localStorage.setItem('words', JSON.stringify(words));
      return words;
    }
    return JSON.parse(rawData)
  }
  setWords(data) {
    localStorage.setItem('words', JSON.stringify(data))
  }
  getProgress() {
    const rawData = localStorage.getItem('progress')
    if (!rawData) return {}
    return JSON.parse(rawData)
  }
  setProgress(data) {
    localStorage.setItem('progress', JSON.stringify(data))
  }
}
const storage = new Storage()
export default storage