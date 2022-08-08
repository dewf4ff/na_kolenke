import React, { useState, useEffect } from "react";
import TransitionTraining from "./components/translate";

const Translation = ({ words, groups, trainingGroups, onChange }) => {
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
      training={trainingGroups}
      group={group}
      count={15}
      type={'word'}
      ready={initinal}
      onFinish={onFinish}       
    />
  )  
};
export default Translation;