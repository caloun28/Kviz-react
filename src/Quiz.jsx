import React, { useState } from 'react';

function Quiz({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = async (answerId) => {
    if (selectedAnswer !== null || isValidating) return;

    setSelectedAnswer(answerId);
    setIsValidating(true);

    try {

      const response = await fetch('https://crm.skch.cz/ajax0/kvizapi.php?action=validationAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answerId: answerId,
        }),
      });

      const result = await response.json();

      if (result.correct) {
        setIsCorrect(true);
        setScore(score + 1);
      } else {
        setIsCorrect(false);
      }
    } catch (error) {
      console.error('Chyba při ověřování odpovědi:', error);
      setIsCorrect(true); 
      setScore(score + 1);
    } finally {
      setIsValidating(false);
    }
  };

  const handleNextClick = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setQuizFinished(false);
    window.location.reload();
  };

  if (quizFinished) {
    return (
      <div className="card result-card">
        <h2>Kvíz dokončen!</h2>
        <p className="score-text">
          Tvoje úspěšnost: <strong>{score}</strong> z <strong>{questions.length}</strong> správně.
        </p>
        <button className="btn btn-primary" onClick={handleRestart}>
          Zkusit znovu
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      {}
      <div className="progress-container">
        <div className="progress-text">
          Otázka {currentQuestionIndex + 1} z {questions.length}
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {}
      <h2 className="question-title">{currentQuestion.questionText || currentQuestion.title}</h2>

      {}
      <div className="answers-list">
        {currentQuestion.answers && currentQuestion.answers.map((answer) => {
          let buttonClass = "answer-btn";
          
          
          if (selectedAnswer === answer.id) {
            if (isCorrect === true) buttonClass += " correct";
            if (isCorrect === false) buttonClass += " incorrect";
          }

          return (
            <button
              key={answer.id}
              className={buttonClass}
              onClick={() => handleAnswerClick(answer.id)}
              disabled={selectedAnswer !== null}
            >
              {answer.text}
            </button>
          );
        })}
      </div>

      {}
      {selectedAnswer !== null && (
        <div className="actions-container">
          <button className="btn btn-next" onClick={handleNextClick}>
            {currentQuestionIndex + 1 === questions.length ? "Dokončit kvíz" : "Další otázka →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;