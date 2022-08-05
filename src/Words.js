import React, { useState, useEffect } from "react";
import TransitionTraining from "./components/translate";
import storage from "./common/storage";

const Words = () => {
  const [initinal, setInitinal] = useState(false);
  const [group, setGroup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [words, setWords] = useState([]);
  useEffect(() => {
    (async () => {
      const w = await storage.getWords()
      const a = storage.getProgress()
      const words = w
        .map(it => {
          const progress = a[it.word]
          const success = progress ? progress.progress : 0
          const shows = progress ? progress.shows : 0
          return {...it, shows, success, progress: progress && !isNaN(success/shows) ? success/shows : 0 }
        })
  
      const g = w.reduce((result, item) => {
        if (result.includes(item.group)) return result;
        result.push(item.group)
        return result;
      }, [])
      setGroups(g)
      setWords(words)
    })()
  }, [initinal])
  
  useEffect(() => { return () => { 
    setInitinal(false); 
    
  }}, [])
  
  const onStart = (group) => {
    setGroup(group)
    setInitinal(true)
  }

  const onFinish = (result) => {
    const a = storage.getProgress()
    result.forEach(it => {
      if (!a[it.word]) {
        a[it.word] = {
          shows: 0,
          progress: 0
        }
      }
      a[it.word].shows += 1
      a[it.word].progress += it.isRight ? 1 : 0
    })
    storage.setProgress(a)
    setInitinal(false)
  }
  
  
  if (!initinal) {
    return (
      <div className="module row align-items-center">
        <div className="col-4 offset-4 justify-content-center">
          <div className="row">
            <div className="col">
              <div className="d-grid gap-2">
                { groups.map((it, i) => (
                  <button key={i} className="btn btn-primary" onClick={() => onStart(it)}>{it || 'Остальное'}</button>
                )) }
              </div>
            </div>  
          </div>
        </div>
      </div>
    )
  }
  return (
    <TransitionTraining 
      words={words} 
      group={group}
      count={10}
      type={'translation'}
      ready={initinal}
      onFinish={onFinish} 
    />
  )  
}
export default Words;