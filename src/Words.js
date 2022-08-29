import React, { useState, useEffect } from "react";
import TransitionTraining from "./components/translate";

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Words = ({ words, groups, trainingGroups, onChange }) => {
  const [training, setTraining] = useState(null);
  const [group, setGroup] = useState(false);

  useEffect(() => { return () => { setTraining(null); }}, [])
  
  const onStart = (group) => {
    setGroup(group)
    const training = []
    trainingGroups.groupA[group].slice(0, 7).forEach(word => training.push(word))
    if (trainingGroups.groupB[group].length) {
      const rememberGroup = Math.trunc((20 - training.length) * 0.2)
      if (trainingGroups.groupB[group].length <= rememberGroup) {
        trainingGroups.groupB[group].forEach(word => training.push(word))
      } else {
        let i = 0;
        const used = []
        while(i < rememberGroup) {
          const r = random(0, trainingGroups.groupB[group].length - 1)
          if (used.includes(trainingGroups.groupB[group][r])) continue;
          used.push(trainingGroups.groupB[group][r])
          training.push(trainingGroups.groupB[group][r])
          i++
        }
      }
    }
    const delta = 20 - training.length
    trainingGroups.groupC[group].slice(0, delta).forEach(word => training.push(word))
    console.log('training', training)
    setTraining(training)
  }

  const onFinish = (result) => {
    onChange(result, group)
    setTraining(null)
  }
  
  if (!training) {
    return (
      <div className="module row align-items-center mt-3">
        <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-12 offset-sm-0 justify-content-center">
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
      trainingGroups={trainingGroups}
      training={training}
      group={group}
      count={20}
      type={'translation'}
      ready={!!training}
      onFinish={onFinish} 
    />
  )  
}
export default Words;