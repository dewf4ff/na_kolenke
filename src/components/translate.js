import React, { useState, useEffect, useRef } from "react"

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function TransitionTraining({ group, words, type, onFinish, count, training }) {
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState([])
  const [currAnswer, setAnswer] = useState(null)
  useEffect(() => {
    const groupB = words.filter(word => word.group === group && (word.progress * 100) > 95)    
    const trainingWords = []
    const used = []
    const used2 = []
    const groupBln = Math.trunc((count/100)*30)
    
    // Выбираем слова для повторения
    if (groupB.length <= groupBln) {
      groupB.forEach(it => trainingWords.push({...it, answers: getAnswers(training[group], it, type)}))
    } else {
      // Сортируем по показам и берем 30% наименьших показов
      groupB.sort((a, b) => a.shows - b.shows)
      const minLn = Math.trunc(groupBln/2)
      // Половину наполняем из редко показываемых
      groupB.slice(0, minLn).forEach(it => trainingWords.push({...it, answers: getAnswers(training[group], it, type)}))
      // Оставшиесмя рандомно
      for (let i=0; i<(groupBln-minLn); i++) {
        const words = groupB.filter(it => !used.includes(it.word))
        if (!words.length) break;
        const r = random(0, words.length - 1)
        used.push(words[r].word)
        trainingWords.push({...words[r], answers: getAnswers(training[group], words[r], type)})
      }
    }

    // Выбираем слова для изучения
    const delta = count-trainingWords.length
    for (let i=0; i<delta; i++) {
      const words = training[group].filter(it => !used2.includes(it.word))
      if (!words.length) break;
      const r = random(0, words.length - 1)
      used2.push(words[r].word)
      trainingWords.push({...words[r], answers: getAnswers(training[group], words[r], type)})
    }

    console.log('OK', trainingWords)

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
  
  return (
    <div className="module row align-items-center mt-3" ref={containerRef}>
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-12 offset-sm-0 justify-content-center">
        
        <div className="row">
          <div className="col mb-5">
            <div className="word-card">
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