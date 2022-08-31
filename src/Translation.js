import React, { useState, useEffect } from "react";
import TransitionTraining from "./components/translate";
const COUNT = 25
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Translation = ({ words, groups, trainingGroups, onChange, step }) => {
  const [training, setTraining] = useState(null);
  const [group, setGroup] = useState(false);

  useEffect(() => { return () => { setTraining(null); }}, [])
  
  const onStart = (group) => {
    setGroup(group)
    const training = []
    if (step) {
      const data = trainingGroups.groupA[group].slice(0, 10)
      trainingGroups.groupB[group].slice(0, 5).forEach(it => data.push(it))
      for (let i = 0; i<(data.length * 2) && i<COUNT; i++) {
        const r = random(0, data.length - 1)
        training.push(data[r])
      }
      const delta = COUNT - training.length
      if (delta > 0) {
        trainingGroups.groupC[group].slice(0, delta).forEach(word => training.push(word))
      }
      console.log('training', training)
    } else {
      trainingGroups.groupC[group].slice(0, COUNT).forEach(word => training.push(word))
      if (training.length < COUNT) {
        trainingGroups.groupA[group].slice(0, COUNT - training.length).forEach(word => training.push(word))
      }
    }
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
      count={25}
      type={'word'}
      ready={!!training}
      onFinish={onFinish}       
    />
  )  
};
export default Translation;