import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Words from "./Words";
import Translation from "./Translation";
import Home from "./Home";
import storage from "./common/storage";
import Exam from "./Exam";
const COUNT = 15;

function App() {
  const [words, setWords] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    if (words) return;
    storage.getWords().then(res => setWords(res))
  }, [words])
  
  useEffect(() => {
    if (!words) return;
    console.log('prepare', words)
    const prepareWords = async () => {
      const storageGroups = storage.getGroups()
      const step = storage.getStep()
      const groups = words.reduce((result, item) => {
        if (!result.includes(item.group)) {
          result.push(item.group)
        }
        return result
      }, [])
  
      // Создаем отсутствующие группы и удаляем не нужные
      groups.forEach(group => {
        if (!storageGroups.groupA[group]) {
          storageGroups.groupA[group] = []
        }
        if (!storageGroups.groupB[group]) {
          storageGroups.groupB[group] = []
        }
        if (!storageGroups.groupC[group]) {
          storageGroups.groupC[group] = []
        }
      })
      Object.keys(storageGroups).forEach(namespace => {
        Object.keys(storageGroups[namespace]).filter(group => !groups.includes(group)).forEach(group => {
          delete storageGroups[namespace][group]
        })
      });
  
      // Удаляем в группах слова, которых нет
      Object.keys(storageGroups).forEach(namespace => {
        Object.keys(storageGroups[namespace]).forEach(group => {
          const g = []
          storageGroups[namespace][group].forEach(word => {
            const exists = words.find(it => it.word === word)
            if (exists) {
              g.push(word)
            }
          })
          storageGroups[namespace][group] = g
        })
      })
      // Добавляем новые слова
      words.forEach(word => {
        const existsA = storageGroups.groupA[word.group].find(it => it === word.word)
        const existsB = storageGroups.groupB[word.group].find(it => it === word.word)
        const existsC = storageGroups.groupC[word.group].find(it => it === word.word)
        if (!existsA && !existsB && !existsC) {
          storageGroups.groupA[word.group].push(word.word)
        }
      })
      return { groups, data: storageGroups, words, step }
    }
    prepareWords().then(res => {
      storage.setGroups(res.data)
      console.log('res.data', res.data)
      setData(res)
    })
  }, [words])
  
  const onChange = (result, group) => {
    const groups = { a: [], b: [], c: [] }
    Object.keys(result).forEach(word => {
      if (data.data.groupA[group].includes(word)) {
        groups.a.push(word)
        return
      }
      if (data.data.groupB[group].includes(word)) {
        groups.b.push(word)
        return
      } 
      if (data.data.groupC[group].includes(word)) {
        groups.c.push(word)
        return
      }
    })
    const storageGroups = storage.getGroups()
    const rawProgress = storage.getProgress()
    
    // Group A
    groups.a.forEach(word => {
      if (!rawProgress[word]) {
        rawProgress[word] = {
          shows: 0,
          progress: 0
        }
      }
      rawProgress[word].shows += result[word].shows
      rawProgress[word].progress += result[word].progress
      const progress = rawProgress[word].progress / rawProgress[word].shows
      if (rawProgress[word].shows >= 6) {
        const ind = storageGroups.groupA[group].indexOf(word)
        if (progress >= 0.9) {
          if (ind !== -1) {
            storageGroups.groupA[group].splice(ind, 1)
            storageGroups.groupB[group].push(word)
            rawProgress[word].shows = 0
            rawProgress[word].progress = 0
          }
        }
      }
    })
    // Group B
    groups.b.forEach(word => {
      if (!rawProgress[word]) {
        rawProgress[word] = {
          shows: 0,
          progress: 0
        }
      }
      rawProgress[word].shows += result[word].shows
      rawProgress[word].progress += result[word].progress
      const progress = rawProgress[word].progress / rawProgress[word].shows
      const ind = storageGroups.groupB[group].indexOf(word)
      if (rawProgress[word].shows >= 5) {
        if (progress >= 0.9) {
          if (ind !== -1) {
            storageGroups.groupB[group].splice(ind, 1)
            storageGroups.groupC[group].push(word)
            rawProgress[word].shows = 0
            rawProgress[word].progress = 0
          }
        } else {
          if (ind !== -1) {
            storageGroups.groupB[group].splice(ind, 1)
            storageGroups.groupA[group].splice(0, 0, word)
            rawProgress[word].shows = 0
            rawProgress[word].progress = 0
          }
        }
      } else {
        if (ind !== -1) {
          storageGroups.groupB[group].splice(ind, 1)
          storageGroups.groupB[group].push(word)
        }
      }
    })
    // Group C
    groups.c.forEach(word => {
      const progress = result[word].progress / result[word].shows
      const ind = storageGroups.groupC[group].indexOf(word)
      if (progress === 1) {
        if (ind !== -1) {
          storageGroups.groupC[group].splice(ind, 1)
          storageGroups.groupC[group].push(word)
        }
      } else {
        rawProgress[word] = { shows: 0, progress: 0 }
        if (ind !== -1) {
          storageGroups.groupC[group].splice(ind, 1)
          storageGroups.groupB[group].push(word)
        }
      }
    })
    storage.setGroups(storageGroups)
    storage.setProgress(rawProgress)
    storage.setStep(!data.step)
    setData({
      ...data,
      step: !data.step,
      data: storageGroups
    })
  }
  const updateAfterExam = (result, group) => {
    const storageGroups = storage.getGroups()
    storageGroups.groupA[group] = result.map(it => it.word)
    const wordGroup = data.words.filter(it => it.group === group).map(it => it.word)
    storageGroups.groupC[group] = wordGroup.filter(it => !storageGroups.groupA[group].includes(it))
    storageGroups.groupB[group] = []
    storage.setGroups(storageGroups)
    setData({
      ...data,
      data: storageGroups
    })
    window.location.href = '/'
  }
 
  if (!data) return null;
  return (
    <Router>
      <div className="container">
        <div className="row">
          <nav className="navbar navbar-expand-lg navbar-expand-md navbar-light bg-light">
            <Link to="/" className="navbar-brand">Wörtertrainer</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/words" className="nav-link">Words</Link>
                </li>
                <li className="nav-item">
                  <Link to="/translation" className="nav-link">Translation</Link>
                </li>
                <li className="nav-item">
                  <Link to="/exam" className="nav-link">Exam</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<Home groups={data.groups} words={data.words} />} />
          <Route path="/words" element={<Words onChange={onChange} step={data.step} words={words} groups={data.groups} trainingGroups={data.data} />} />
          <Route path="/translation" element={<Translation onChange={onChange} step={data.step} words={words} groups={data.groups} trainingGroups={data.data}/>} />
          <Route path="/exam" element={<Exam onChange={updateAfterExam} words={words} groups={data.groups} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
