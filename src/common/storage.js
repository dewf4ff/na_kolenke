import Papa from "papaparse";
const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHSMmju12mbRUZW3kAkQsY0ddBD2UQhoftwc4QrPSAIRndkxOqmbvIMT3HG7H9kBXB6jkNl76C3vEw/pub?gid=0&single=true&output=csv'
class Storage {
  async getWords() {
    return new Promise((resolve) => {
      Papa.parse(url, {
        download: true,
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
      });  
    })
  }
  getProgress() {
    const rawData = localStorage.getItem('progress')
    if (!rawData) return {}
    return JSON.parse(rawData)
  }
  setProgress(data) {
    localStorage.setItem('progress', JSON.stringify(data))
  }
  getGroup() {
    const rawData = localStorage.getItem('group')
    if (!rawData) return null
    return JSON.parse(rawData)
  }
  setGroup(group) {
    localStorage.setItem('group', JSON.stringify(group))
  }
}
const storage = new Storage()
export default storage