import React, { useState, useEffect } from "react";
import ExamTraining from "./components/exam";

const Exam = ({ words, groups, onChange }) => {
  const [initinal, setInitinal] = useState(false);
  const [group, setGroup] = useState(false);

  useEffect(() => { return () => { setInitinal(false); }}, [])
  
  const onStart = (group) => {
    setGroup(group)
    setInitinal(true)
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
    <ExamTraining
      words={words}
      group={group}
      type={'translation'}
      setProgress={onChange}
    />
  )  
}
export default Exam;