import React, { useState, useEffect } from "react"
import storage from "./common/storage";
const Home = ({ groups, words }) => {
  const [progress, setProgress] = useState(null);
  const [globalGroups, setGroups] = useState(null);
  useEffect(() => {
    const a = storage.getProgress()
    const storageGroups = storage.getGroups()
    const globalProgress = {}
    groups.forEach(group => {
      globalProgress[group] = storageGroups.groupC[group].length || 0
    })
    setGroups(storageGroups)
    setProgress(globalProgress)
  }, [])
  if (!globalGroups) return null;
  return (
    <div className="row">
      <div className="col">
        {groups.map((it, i) => {
          const groupProgress = progress && progress[it] ? progress && progress[it] : 0
          const groupLength = words.filter(word => word.group === it).length
          const groupPercentProgress = (groupProgress / groupLength) * 100
          return (
            <div key={i} className="row mt-3">
              <div className="col-4">{it}</div>
              <div className="col-3">Всего слов: {groupLength}</div>
              <div className="col-3">Изучено: {`${groupPercentProgress.toFixed(2)}%`} ({groupProgress})</div>
              <div className="col-2">
                <div className="progress">
                  <div className="progress-bar" style={{width: `${groupPercentProgress}%`}} role="progressbar"  aria-valuenow={groupPercentProgress} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="row mt-3">
      <div className="col-2"><b>Всего слов: {words.length} Осталось: {words.length - Object.keys(globalGroups.groupC).reduce((res, it) => res += globalGroups.groupC[it].length, 0)}</b></div>
      </div>
    </div>
  )
}
export default Home