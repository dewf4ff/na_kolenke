import React, { useState, useEffect, useRef } from "react"

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function TransitionTraining({ group, words, type, onFinish, training, trainingGroups }) {
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState([])
  const [currAnswer, setAnswer] = useState(null)
  useEffect(() => {
    const trainingWords = []
    const wordsGroup = words.filter(word => word.group === group)
    training.forEach(word => {
      const realWord = words.find(it => it.word === word)
      trainingWords.push({...realWord, answers: getAnswers(wordsGroup, realWord, type)})
    })
    setTrainingWords(trainingWords)
    setReady(true)
    return () => { setCurrent(0) }
  }, [group])

  const [trainingWords, setTrainingWords] = useState([]);
  const [current, setCurrent] = useState(0);

  const getAnswers = (array, el, param) => {
    const result = [el[param]]
    const data = array.filter(it => it.word !== el.word)
    const ln = data.length > 3 ? 3 : data.length
    for (let i=0; i < ln; i++) {
      const array = data.filter(it => !result.includes(it[param]))
      const r = random(0, array.length - 1)
      result.push(array[r][param])
    }
    
    let currentIndex = result.length,  randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
    }
    return result;
  }

  const setNext = (result) => {
    setResult(result)
    if (current < trainingWords.length - 1) {
      setCurrent(current + 1)
    } else {
      const progress = {}
      result.forEach(it => {
        if (!progress[it.word]) {
          progress[it.word] = {
            shows: 0,
            progress: 0
          }
        }
        
        progress[it.word].shows += 1
        progress[it.word].progress += it.isRight ? 1 : 0
      })
      onFinish(progress)
    }
  }

  const onAnswer = (answer, event) => {
    const currResult = [...result]
    event.currentTarget.blur();
    if (containerRef.current) {
      containerRef.current.focus();
    }
    if (currAnswer) return;
    if (answer === trainingWords[current].word || answer === trainingWords[current].translation) {
      currResult.push({ word: trainingWords[current].word, isRight: true })
      setNext(currResult)
    } else {
      currResult.push({ word: trainingWords[current].word, isRight: false })
      setAnswer(answer)
      const timer = setTimeout(() => {
        setAnswer(null)
        clearTimeout(timer)
        setNext(currResult)
      }, 2000)
    }
  }
  const t = type === 'translation' ? 'word' : 'translation'
  if (!ready) return null;

  const getButtonStyle = (val) => {
    if (!currAnswer) return 'btn btn-outline-secondary';
    if (trainingWords[current][type] === val) {
      return 'btn btn-success'
    }
    if (currAnswer === val) {
      return 'btn btn-danger'
    }
    return 'btn btn-outline-secondary'
  }

  const progressPercent = (current / trainingWords.length) * 100
  const getGroup = (word) => {
    console.log('trainingGroups', trainingGroups)
    if (trainingGroups.groupA[group].includes(word)) {
      return 'bullet bullet-red'
    }
    if (trainingGroups.groupB[group].includes(word)) {
      return 'bullet bullet-yellow'
    }
    if (trainingGroups.groupC[group].includes(word)) {
      return 'bullet bullet-green'
    }
  }
  return (
    <div className="module row align-items-center mt-3" ref={containerRef}>
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-12 offset-sm-0 justify-content-center">
        
        <div className="row">
          <div className="col mb-5">
            <div className="word-card">
              <div className={getGroup(trainingWords[current].word)}/>
              <h5>{trainingWords[current][t]}</h5>
            </div>
            <div className="progress progress-custom">
              <div className="progress-bar" style={{width: `${progressPercent}%`}} role="progressbar"  aria-valuenow={0} aria-valuemin="0" aria-valuemax={trainingWords.length.toString()}></div>
            </div>
          </div>  
        </div>
        { trainingWords[current].answers && trainingWords[current].answers.map((it, i) => (
          <div className="row" key={i}>
            <div className="col gy-2">
              <div className="d-grid gap-2">
                <button 
                  type="button"
                  className={getButtonStyle(it)} 
                  onClick={(event) => onAnswer(it, event)}>{it}</button>  
              </div>
            </div>  
          </div>
        )) }
      </div>
    </div>
  )
}

export default TransitionTraining