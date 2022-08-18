import React, { useState, useEffect, useRef } from "react"

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ExamTraining({ group, words, type, setProgress }) {

  const [trainingWords, setTrainingWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState([])
  
  
  useEffect(() => {
    const trainingWords = [];
    const data = words.filter(word => word.group === group)   
    data.forEach(word => {
      trainingWords.push({...word, answers: getAnswers(data, word, type)})
    })
    setTrainingWords(trainingWords)
    setReady(true)
    return () => { setCurrent(0) }
  }, [group])

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
  const onFinish = (result) => console.log(result)

  const setNext = (result) => {
    setResult(result)
    if (current < trainingWords.length - 1) {
      setCurrent(current + 1)
    } else {
      onFinish(result)
    }
  }

  const onAnswer = (answer, event) => {
    const currResult = [...result]
    if (result.length === trainingWords.length) return;
    if (!answer) {
      currResult.push({ word: trainingWords[current].word, isRight: false })
      setNext(currResult)
      return
    }
    const isRight = answer === trainingWords[current].word || answer === trainingWords[current].translation
    currResult.push({ word: trainingWords[current].word, isRight: isRight })
    setNext(currResult)
  }
  const t = type === 'translation' ? 'word' : 'translation'
  if (!ready) return null;

  const unknownWords = result.filter(it => !it.isRight)

  if (result.length === trainingWords.length) {
    return (
      <div className="module row mt-3">
        <div className="col-12">
          <div className="row">
            <div className="col-2">
              Всего слов: {result.length}
            </div>
            <div className="col-2">
              Не изучено слов: {unknownWords.length}
            </div>
            <div className="col-2">
              <button className="btn btn-primary" onClick={() => setProgress(unknownWords, group)}>Сформировать тренировку</button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              Неизученные слова
            </div>
            {unknownWords.map((word, i) => (
              <div key={`w-${i}`} className="col-12">
                <b>{word.word}</b> - {words.find(it => it.word === word.word).translation}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
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
                <button 
                  type="button"
                  className="btn btn-outline-secondary" 
                  onClick={(event) => onAnswer(it, event)}>{it}</button>   
              </div>
            </div>  
          </div>
        )) }
        <div className="row">
          <div className="col gy-2">
            <div className="d-grid gap-2">
              <button 
                type="button"
                className="btn btn-danger"
                onClick={(event) => onAnswer()}>Не знаю</button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamTraining