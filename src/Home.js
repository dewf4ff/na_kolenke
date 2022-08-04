import React, { useState, useEffect } from "react"
import storage from "./common/storage";
const Home = () => {
  const [groups, setGroups] = useState([]);
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState(null);
  useEffect(() => {
    (async () => {
      const w = await storage.getWords()
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
          const r = shows < 5 ? 0 : (a[word.word] && !isNaN(progress/shows) ? progress/shows : 0) * 100 
          globalProgress[group] += r
        })
        globalProgress[group] = globalProgress[group] / groupWords.length
      })
      setProgress(globalProgress)
    })()
  }, [])
  return (
    <div className="row">
      <div className="col">
        {groups.map((it, i) => {
          const groupProgress = progress && progress[it] ? progress && progress[it] : 0
          const groupLength = words.filter(word => word.group === it).length
          return (
            <div key={i} className="row mt-3">
              <div className="col">{it}</div>
              <div className="col">Всего слов: {groupLength}</div>
              <div className="col">Изучено: {`${groupProgress.toFixed(0)}%`} ({((groupLength / 100) *  groupProgress).toFixed(0)})</div>
              <div className="col">
                <div className="progress">
                  <div className="progress-bar" style={{width: `${groupProgress}%`}} role="progressbar"  aria-valuenow={`${groupProgress}`} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Home