import React, { useState, useEffect } from "react";
import TransitionTraining from "./components/translate";

const Words = ({ words, groups, trainingGroups, onChange }) => {
  const [initinal, setInitinal] = useState(false);
  const [group, setGroup] = useState(false);

  useEffect(() => { return () => { setInitinal(false); }}, [])
  
  const onStart = (group) => {
    setGroup(group)
    setInitinal(true)
  }

  const onFinish = (result) => {
    onChange(result)
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
      training={trainingGroups}
      group={group}
      count={15}
      type={'translation'}
      ready={initinal}
      onFinish={onFinish} 
    />
  )  
}
export default Words;