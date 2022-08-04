import React, { useState, useEffect } from "react"

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function TransitionTraining({ group, words, type, onFinish }) {
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState([])
  const [currAnswer, setAnswer] = useState(null)
  useEffect(() => {
    /*
      Выделяем 3 группы:
      1. GroupA Слова которые изучены меньше 30% - из них отбираем 60% для рандомайзера
      2. GroupB Слова которые изучены от 30% до 90% - из них отбираем 30% для рандомайзера
      3. GroupC Слова которые изучены свыше 90% - из них отбираем 10% для рандомайзера
    */
    const data = words.filter(it => it.group === group)
    const groupA = data.filter(it => (it.progress * 100) < 30)
    const groupB = data.filter(it => (it.progress * 100) < 90 && (it.progress * 100) >= 30)
    const groupC = data.filter(it => (it.progress * 100) >= 90)
    
    const used = []
    const training = []
    // Формируем слова для начального изучения 
    if (groupA.length <= 7) {
      groupA.forEach(it => training.push({...it, answers: getAnswers(data, it, type)}))
    } else {
      for (let i=0; i<7; i++) {
        const words = groupA.filter(it => !used.includes(it.word))
        if (!words.length) break;
        const r = random(0, words.length - 1)
        used.push(words[r].word)
        training.push({...words[r], answers: getAnswers(data, words[r], type)})
      }
    }

    // Формируем слова для запоминания 
    if (groupB.length <= 3) {
      groupB.forEach(it => training.push({...it, answers: getAnswers(data, it, type)}))
    } else {
      for (let i=0; i<3; i++) {
        const words = groupB.filter(it => !used.includes(it.word))
        if (!words.length) break;
        const r = random(0, words.length - 1)
        used.push(words[r].word)
        training.push({...words[r], answers: getAnswers(data, words[r], type)})
      }
    }

    // Формируем слова для повторения 
    if (groupC.length <= 1) {
      groupC.forEach(it => training.push({...it, answers: getAnswers(data, it, type)}))
    } else {
      for (let i=0; i<1; i++) {
        const words = groupC.filter(it => !used.includes(it.word))
        if (!words.length) break;
        const r = random(0, words.length - 1)
        used.push(words[r].word)
        training.push({...words[r], answers: getAnswers(data, words[r], type)})
      }
    }

    // Добавляем слова в тренировку если в какой-то из групп было меньше необходимого
    if (training.length < 10) {
      const maxGroup = [ groupA, groupB, groupC ].sort((a,b) => b.length - a.length)
      const delta = 10 - training.length
      for (let i=0; i<delta; i++) {
        const r = random(0, maxGroup[0].length - 1)
        training.push({...maxGroup[0][r], answers: getAnswers(data, maxGroup[0][r], type)})
      }
    }
    
    setTrainingWords(training)
    setReady(true)
    return () => { setCurrent(0) }
  }, [group])

  const [trainingWords, setTrainingWords] = useState([]);
  const [current, setCurrent] = useState(0);

  const getAnswers = (array, el, param) => {
    console.log(1, el, param)
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
      onFinish(result)
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
    if (!currAnswer) return 'btn btn-outline-secondary';
    if (trainingWords[current][type] === val) {
      return 'btn btn-success'
    }
    if (currAnswer === val) {
      return 'btn btn-danger'
    }
    return 'btn btn-outline-secondary'
  }
  
  return (
    <div className="module row align-items-center">
      <div className="col-4 offset-4 justify-content-center">
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
                  className={getButtonStyle(it)} 
                  onClick={() => onAnswer(it)}>{it}</button>  
              </div>
            </div>  
          </div>
        )) }
      </div>
    </div>
  )
}

export default TransitionTraining