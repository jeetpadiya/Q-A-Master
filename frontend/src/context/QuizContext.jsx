import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const QuizContext = createContext();

const QuizContextProvider = ({ children }) => {
  const [questions, setQuestions]       = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore]               = useState(0);
  const [timer, setTimer]               = useState(10);
  const [isTimeUp, setIsTimeUp]         = useState(false);
  const [isQuizEnd, setIsQuizEnd]       = useState(false);
  const [userAnswers, setUserAnswers]   = useState([]);

  const backendUrl = "http://localhost:3000";

  // 1. Fetch questions once
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/questions`)
      .then(({ data }) => {
        if (data.success) setQuestions(data.questions);
      })
      .catch(console.error);
  }, []);

  // 2. Countdown timer
  useEffect(() => {
    if (currentQuestion >= questions.length || isTimeUp || isQuizEnd) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimeUp(true);
          return 10;               // reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, isTimeUp, isQuizEnd, questions.length]);

  // 3. Handle a user (or timeout) answer
  const handleAnswer = (selectedAnswer) => {
    const q = questions[currentQuestion];
    const correct = q.correctAnswer;    // use the real key
    // record the answer
    setUserAnswers((prev) => [
      ...prev,
      {
        question: q.question,           // question text
        correctAnswer: correct,
        selectedAnswer,
      },
    ]);
    // increment score if right
    if (selectedAnswer === correct) {
      setScore((s) => s + 1);
    }
    // trigger the “move on” effect
    setIsTimeUp(true);
  };

  // 4. Move to next question exactly once
  const handleNextQuestions = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setTimer(10);
      setIsTimeUp(false);
    } else {
      setIsQuizEnd(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimer(10);
    setIsTimeUp(false);
    setIsQuizEnd(false);
    setUserAnswers([]);
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        currentQuestion,
        score,
        timer,
        isTimeUp,
        isQuizEnd,
        userAnswers,
        handleAnswer,
        handleNextQuestions,
        handleRestartQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;