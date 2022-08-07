import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Words from "./Words";
import Translation from "./Translation";
import Home from "./Home";
import storage from "./common/storage";
const COUNT = 15;

function App() {
  const [data, setData] = useState(null);
  const prepareWords = async () => {
    const rawWords = await storage.getWords()
    const rawProgress = storage.getProgress()
    let trainingGroups = storage.getGroup()
    if (!trainingGroups) {
      trainingGroups = {}
    }

    const { words, groups } = rawWords.reduce((result, item) => {
      if (!trainingGroups[item.group]) {
        trainingGroups[item.group] = []
      }
      if (!result.groups.includes(item.group)) {
        result.groups.push(item.group)
      }
      const progress = rawProgress[item.word]
      const success = progress ? progress.progress : 0
      const shows = progress ? progress.shows : 0
      result.words.push({...item, shows, success, progress: progress && !isNaN(success/shows) ? success/shows : 0 })
      return result
    }, { words: [], groups: [] })
    
    // Наполняем группы если они пустые
    groups.forEach(group => {
      if (!trainingGroups[group].length) {
        const training = words.filter(word => word.group === group).sort((a,b) => a.progress - b.progress).slice(0, COUNT * 2);
        training.forEach(word => trainingGroups[group].push({ group: word.group, word: word.word, translation: word.translation }))
      }
    })
    return { words, groups, trainingGroups }
  }
  useEffect(() => {
    if (data) return;
    prepareWords().then(res => {
      storage.setGroup(res.trainingGroups)
      setData(res)
    })
  })

  const onChange = (result) => {
    const rawProgress = storage.getProgress()
    Object.keys(result).forEach(word => {
      if (!rawProgress[word]) {
        rawProgress[word] = {
          progress: 0,
          shows: 0
        }
      }
      rawProgress[word].progress += result[word].progress
      rawProgress[word].shows += result[word].shows
    })
    
    prepareWords().then(res => {
      storage.setGroup(res.trainingGroups)
      storage.setProgress(rawProgress) 
      setData(res)
    })
  }

  if (!data) return null;
  return (
    <Router>
      <div className="container">
        <div className="row">
          <div className="col">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <Link to="/" className="navbar-brand">Wörtertrainer</Link>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                    <Link to="/words" className="nav-link">Words</Link>
                  </li>
                  <li className="nav-item active">
                    <Link to="/translation" className="nav-link">Translation</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/words" element={<Words onChange={onChange} words={data.words} groups={data.groups} trainingGroups={data.trainingGroups} />} />
          <Route path="/translation" element={<Translation onChange={onChange} words={data.words} groups={data.groups} trainingGroups={data.trainingGroups}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
