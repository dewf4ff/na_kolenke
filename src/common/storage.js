import Papa from "papaparse";
const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHSMmju12mbRUZW3kAkQsY0ddBD2UQhoftwc4QrPSAIRndkxOqmbvIMT3HG7H9kBXB6jkNl76C3vEw/pub?gid=0&single=true&output=csv'
class Storage {
  async getWords() {
    const additionalUrl = localStorage.getItem("url")
    if (additionalUrl) {
      console.log('Load from url:', additionalUrl)
    } else {
      console.log('Load from default url')
    }
    return new Promise((resolve) => {
      Papa.parse(additionalUrl ? additionalUrl : url, {
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
  getStep() {
    const rawData = localStorage.getItem('step')
    if (!rawData) return false
    return JSON.parse(rawData)
  }
  setStep(step) {
    localStorage.setItem('step', JSON.stringify(step))
  }
  getGroups() {
    const rawData = localStorage.getItem('groups')
    if (!rawData) return {
      groupA: {},
      groupB: {},
      groupC: {}
    }
    return JSON.parse(rawData)
  }
  setGroups(data) {
    localStorage.setItem('groups', JSON.stringify(data))
  }

}
const storage = new Storage()
export default storage