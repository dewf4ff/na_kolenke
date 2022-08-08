import React, { useState, useEffect } from "react"
import Button from 'react-bootstrap/Button';
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function TransitionTraining({ group, words, type, onFinish, count, training }) {
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState([])
  const [currAnswer, setAnswer] = useState(null)
  useEffect(() => {
    const groupB = words.filter(word => word.group === group && word.progress * 100 > 95)    
    const trainingWords = []
    const used = []
    const used2 = []
    const groupBln = Math.trunc(count/100*20)
    
    // Выбираем слова для повторения
    if (groupB.length <= groupBln) {
      groupB.forEach(it => trainingWords.push({...it, answers: getAnswers(training[group], it, type)}))
    } else {
      for (let i=0; i<groupBln; i++) {
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

  const onAnswer = (answer) => {
    const currResult = [...result]
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
    if (!currAnswer) return 'outline-secondary';
    if (trainingWords[current][type] === val) {
      return 'success'
    }
    if (currAnswer === val) {
      return 'danger'
    }
    return 'outline-secondary'
  }
  
  return (
    <div className="module row align-items-center mt-3">
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-12 offset-sm-0 justify-content-center">
        <div className="row">
          <div className="col mb-5">
            <div className="word-card">
              <h5>{trainingWords[current][t]}</h5>
            </div>
          </div>  
        </div>
        { trainingWords[current].answers && trainingWords[current].answers.map((it, i) => (
          <div className="row" key={i}>
            <div className="col gy-2">
              <div className="d-grid gap-2">
                <Button variant={getButtonStyle(it)} onClick={() => onAnswer(it)}>{it}</Button>
              </div>
            </div>  
          </div>
        )) }
      </div>
    </div>
  )
}

export default TransitionTraining