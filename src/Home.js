import React, { useState, useEffect } from "react"
import storage from "./common/storage";
const Home = ({ groups, words }) => {
  const [progress, setProgress] = useState(null);
  useEffect(() => {
    const a = storage.getProgress()
    const globalProgress = {}
    groups.forEach(group => {
      let maxShow = 0
      Object.keys(a).forEach(word => {
        const originalWord = words.find(it => it.word === word && it.group === group)
        if (a[word].shows > maxShow && originalWord) {
          maxShow = a[word].shows
        }
      })
      maxShow = Math.trunc(maxShow / 4) > 2 ? Math.trunc(maxShow / 4) : 2
      globalProgress[group] = 0
      const groupWords = words.filter(it => it.group === group)
      groupWords.forEach(word => {
        const progress = a[word.word] ? a[word.word].progress : 0
        const shows = a[word.word] ? a[word.word].shows : 0
        const r = (a[word.word] && !isNaN(progress/shows) ? progress/shows : 0) * 100
        globalProgress[group] += shows >= maxShow && r >= 95 ? 1: 0
      })
    })
    setProgress(globalProgress)
  }, [])
  return (
    <div className="row">
      <div className="col">
        {groups.map((it, i) => {
          const groupProgress = progress && progress[it] ? progress && progress[it] : 0
          const groupLength = words.filter(word => word.group === it).length
          const groupPercentProgress = (groupProgress / groupLength) * 100
          return (
            <div key={i} className="row mt-3">
              <div className="col">{it}</div>
              <div className="col">Всего слов: {groupLength}</div>
              <div className="col">Изучено: {`${groupPercentProgress.toFixed(2)}%`} ({groupProgress})</div>
              <div className="col">
                <div className="progress">
                  <div className="progress-bar" style={{width: `${groupPercentProgress}%`}} role="progressbar"  aria-valuenow={groupPercentProgress} aria-valuemin="0" aria-valuemax="100"></div>
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