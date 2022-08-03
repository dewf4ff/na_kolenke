import React, { useState, useEffect } from "react"
import storage from "./common/storage";
const Home = () => {
  const [groups, setGroups] = useState([]);
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState(null);
  useEffect(() => {
    const w = storage.getWords()
    const a = storage.getProgress()
    setWords(w)
    const g = w.reduce((result, item) => {
      if (result.includes(item.group)) return result;
      result.push(item.group)
      return result;
    }, [])
    setGroups(g)
    const globalProgress = {}
    g.forEach(group => {
      globalProgress[group] = 0
      const groupWords = w.filter(it => it.group == group)
      groupWords.forEach(word => {
        const progress = a[word.word] ? a[word.word].progress : 0
        const shows = a[word.word] ? a[word.word].schows : 0
        const r = (a[word.word] && !isNaN(progress/shows) ? progress/shows : 0) * 100  
        globalProgress[group] += r
      })
      globalProgress[group] = globalProgress[group] / groupWords.length
    })
    setProgress(globalProgress)
  }, [])
  return (
    <div className="row">
      <div className="col">
        {groups.map((it, i) => (
          <div key={i} className="row mt-3">
            <div className="col">{it}</div>
            <div className="col">Всего слов: {words.filter(word => word.group === it).length}</div>
            <div className="col">Изучено: {progress && progress[it] ? `${progress[it].toFixed(2)}%` : '0%'}</div>
            <div className="col">
              <div className="progress">
                <div className="progress-bar" style={{width: progress && progress[it] ? `${progress[it]}%` : '0%'}} role="progressbar"  aria-valuenow={progress && progress[it] ? `${progress[it]}%` : '0'} aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Home