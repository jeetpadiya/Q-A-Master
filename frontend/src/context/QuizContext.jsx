import { createContext, useEffect, useState, useCallback } from "react";
import Cookies from 'js-cookie';
import {
  loginUser,
  registerUser,
  getQuestionsApi,
  submitQuizApi,
  getMyCertificatesApi,
} from "../services/api";

export const QuizContext = createContext();

const decodeTokenPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const QuizContextProvider = ({ children }) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isQuizEnd, setIsQuizEnd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("React");
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem("qa-master-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [earnedCertificates, setEarnedCertificates] = useState([]);
  const [xp, setXp] = useState(user?.xp || 120);
  const [streak, setStreak] = useState(user?.streak || 1);
  const [lastEarnedXp, setLastEarnedXp] = useState(0);

  // Sync token from cookie on tab focus or change
  useEffect(() => {
    const syncTokenFromCookie = () => {
      const cookieToken = Cookies.get("token") || "";
      setToken(cookieToken);
    };

    syncTokenFromCookie();
    window.addEventListener("focus", syncTokenFromCookie);
    document.addEventListener("visibilitychange", syncTokenFromCookie);

    return () => {
      window.removeEventListener("focus", syncTokenFromCookie);
      document.removeEventListener("visibilitychange", syncTokenFromCookie);
    };
  }, []);

  // Fetch verified certificates from MongoDB when user is logged in
  useEffect(() => {
    if (!token) {
      setEarnedCertificates([]);
      return;
    }

    getMyCertificatesApi()
      .then(({ data }) => {
        if (data.success && Array.isArray(data.certificates)) {
          setEarnedCertificates(data.certificates);
        }
      })
      .catch((err) => {
        console.warn("Could not load certificates from server:", err);
      });
  }, [token]);

  // Sync user state to localStorage for quick restore
  useEffect(() => {
    if (user) {
      window.localStorage.setItem("qa-master-user", JSON.stringify(user));
      if (user.xp !== undefined) setXp(user.xp);
      if (user.streak !== undefined) setStreak(user.streak);
    } else {
      window.localStorage.removeItem("qa-master-user");
    }
  }, [user]);

  // Decode user info from JWT if missing in state
  useEffect(() => {
    if (user || !token) return;

    const payload = decodeTokenPayload(token);
    if (!payload?.email) return;

    setUser({
      id: payload.id,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      xp: 120,
      streak: 1,
    });
  }, [token, user]);

  // 1. Fetch sanitized questions
  useEffect(() => {
    getQuestionsApi()
      .then(({ data }) => {
        if (data.success && Array.isArray(data.questions)) {
          setAllQuestions(data.questions);
        }
      })
      .catch((err) => {
        console.error("Failed to load questions:", err);
      });
  }, []);

  const categories = [...new Set(allQuestions.map((q) => q.category))];
  const questions = allQuestions.filter(
    (question) => question.category === selectedCategory
  );

  // Submit answers to server for verified evaluation, XP and streak calculation
  const submitQuizToServer = useCallback(async (answersToSubmit) => {
    setIsSubmitting(true);
    try {
      const { data } = await submitQuizApi({
        category: selectedCategory,
        answers: answersToSubmit,
      });

      if (data.success) {
        setScore(data.score);
        setQuizResults(data.results || []);

        if (data.totalXP !== undefined) {
          setXp(data.totalXP);
        }
        if (data.streak !== undefined) {
          setStreak(data.streak);
        }
        if (data.earnedXP !== undefined) {
          setLastEarnedXp(data.earnedXP);
        }

        setUser((prev) =>
          prev
            ? { ...prev, xp: data.totalXP ?? prev.xp, streak: data.streak ?? prev.streak }
            : prev
        );

        if (data.certificate) {
          setEarnedCertificates((prev) => {
            const exists = prev.some((c) => c.category === data.certificate.category);
            return exists ? prev : [data.certificate, ...prev];
          });
        }
      }
    } catch (error) {
      console.error("Quiz submission error:", error);
    } finally {
      setIsSubmitting(false);
      setIsQuizEnd(true);
    }
  }, [selectedCategory]);

  // 2. Countdown timer
  useEffect(() => {
    if (currentQuestion >= questions.length || isTimeUp || isQuizEnd || isSubmitting) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const q = questions[currentQuestion];
          if (q) {
            setUserAnswers((existing) => {
              const already = existing.some((a) => a.questionId === q.id);
              return already
                ? existing
                : [...existing, { questionId: q.id, question: q.question, selectedAnswer: null }];
            });
          }
          setIsTimeUp(true);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, isTimeUp, isQuizEnd, isSubmitting, questions]);

  // 3. User selects an option
  const handleAnswer = (selectedAnswer) => {
    const q = questions[currentQuestion];
    if (!q) return;

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: q.id,
        question: q.question,
        selectedAnswer,
      },
    ]);

    setIsTimeUp(true);
  };

  // 4. Move to next question or submit at the end
  const handleNextQuestions = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setTimer(10);
      setIsTimeUp(false);
    } else {
      submitQuizToServer(userAnswers);
    }
  }, [currentQuestion, questions.length, submitQuizToServer, userAnswers]);

  // Auto-advance when time is up
  useEffect(() => {
    if (isTimeUp && !isQuizEnd && !isSubmitting) {
      handleNextQuestions();
    }
  }, [isTimeUp, isQuizEnd, isSubmitting, handleNextQuestions]);

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimer(10);
    setIsTimeUp(false);
    setIsQuizEnd(false);
    setIsSubmitting(false);
    setUserAnswers([]);
    setQuizResults([]);
    setLastEarnedXp(0);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(10);
    setIsTimeUp(false);
    setIsQuizEnd(false);
    setIsSubmitting(false);
    setUserAnswers([]);
    setQuizResults([]);
    setLastEarnedXp(0);
  };

  const handleregister = async (name, email, password) => {
    try {
      const { data } = await registerUser({ name, email, password });
      if (data.success) {
        Cookies.set('token', data.token, { expires: 7 });
        setToken(data.token);
        setUser(data.user);
        if (data.user?.xp !== undefined) setXp(data.user.xp);
        if (data.user?.streak !== undefined) setStreak(data.user.streak);
      }
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to register user");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const { data } = await loginUser({ email, password });
      if (data.success) {
        Cookies.set("token", data.token, { expires: 7 });
        setToken(data.token);
        setUser(data.user);
        if (data.user?.xp !== undefined) setXp(data.user.xp);
        if (data.user?.streak !== undefined) setStreak(data.user.streak);
      }
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to login user");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setToken("");
    setUser(null);
    setEarnedCertificates([]);
    setXp(0);
    setStreak(1);
  };

  return (
    <QuizContext.Provider
      value={{
        token,
        user,
        earnedCertificates,
        categories,
        selectedCategory,
        questions,
        currentQuestion,
        score,
        timer,
        isTimeUp,
        isQuizEnd,
        isSubmitting,
        userAnswers,
        quizResults,
        xp,
        streak,
        lastEarnedXp,
        handleAnswer,
        handleNextQuestions,
        handleRestartQuiz,
        handleCategoryChange,
        handleLogout,
        handleregister,
        handleLogin,
        }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
