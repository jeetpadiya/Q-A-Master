import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie'
import { loginUser, registerUser } from "../services/api";
export const QuizContext = createContext();

const decodeTokenPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const QuizContextProvider = ({ children }) => {
  const [allQuestions, setAllQuestions]       = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore]               = useState(0);
  const [timer, setTimer]               = useState(10);
  const [isTimeUp, setIsTimeUp]         = useState(false);
  const [isQuizEnd, setIsQuizEnd]       = useState(false);
  const [userAnswers, setUserAnswers]   = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("React");
  const [token,setToken] = useState(Cookies.get("token") || "");
  const [user,setUser] = useState(() => {
    const storedUser = window.localStorage.getItem("qa-master-user");
    return storedUser ? JSON.parse(storedUser) : null;
  })
  const [earnedCertificates, setEarnedCertificates] = useState([]);

  const backendUrl =
    import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === "localhost" ? "http://localhost:3000" : "");

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

  useEffect(() => {
    if (!user?.email) {
      setEarnedCertificates([]);
      return;
    }

    const storageKey = `certificates:${user.email}`;
    const storedCertificates = window.localStorage.getItem(storageKey);
    setEarnedCertificates(storedCertificates ? JSON.parse(storedCertificates) : []);
  }, [user]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("qa-master-user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("qa-master-user");
    }
  }, [user]);

  useEffect(() => {
    if (user || !token) {
      return;
    }

    const payload = decodeTokenPayload(token);
    if (!payload?.email) {
      return;
    }

    setUser({
      id: payload.id,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
    });
  }, [token, user]);


    //Authentication
    useEffect(()=>{
      const t = Cookies.get('token');
      if(t && token) {
        axios.defaults.headers.common['Authorization'] =`Bearer ${t}`
      }
      else {
        if (token) {
          setToken("");
        }
        delete axios.defaults.headers.common['Authorization']
      }
    },[token]);

    //register handler

    const handleregister = async(name,email,password) =>{
        try {
          const { data } = await registerUser({ name, email, password });

          if(data.success){
            Cookies.set('token',data.token,{expires:7})
            setToken(data.token)
            setUser(data.user)
          }

          return data;
        }
        catch(error){
          console.log(error)
          throw new Error(
            error.response?.data?.message || "Failed to register user"
          );
        }
    }

    const handleLogin = async (email, password) => {
      try {
        const { data } = await loginUser({ email, password });

        if (data.success) {
          Cookies.set("token", data.token, { expires: 7 });
          setToken(data.token);
          setUser(data.user);
        }

        return data;
      } catch (error) {
        console.log(error);
        throw new Error(
          error.response?.data?.message || "Failed to login user"
        );
      }
    };

    const awardCertificate = ({
      category = selectedCategory,
      finalScore = score,
      totalQuestions = questions.length,
    } = {}) => {
      const payload = decodeTokenPayload(token);
      const resolvedEmail = user?.email || payload?.email;
      const resolvedName =
        user?.name || payload?.name || payload?.email?.split("@")[0] || "Learner";

      if (!resolvedEmail || totalQuestions === 0 || finalScore !== totalQuestions) {
        return;
      }

      const certificate = {
        id: `${category}-${resolvedEmail}`,
        category,
        recipientName: resolvedName,
        issuedAt: new Date().toISOString(),
        score: finalScore,
        totalQuestions,
      };

      setEarnedCertificates((prev) => {
        const alreadyExists = prev.some(
          (item) => item.category === category
        );

        if (alreadyExists) {
          return prev;
        }

        const nextCertificates = [...prev, certificate];
        window.localStorage.setItem(
          `certificates:${resolvedEmail}`,
          JSON.stringify(nextCertificates)
        );
        return nextCertificates;
      });
    };

  // 1. Fetch questions once
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/questions`)
      .then(({ data }) => {
        if (data.success) setAllQuestions(data.questions);
      })
      .catch(console.error);
  }, []);

  const categories = [...new Set(allQuestions.map((question) => question.category))];
  const questions = allQuestions.filter(
    (question) => question.category === selectedCategory
  );

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
    const isCorrect = selectedAnswer === correct;
    const finalScore = isCorrect ? score + 1 : score;
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
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    if (currentQuestion === questions.length - 1 && finalScore === questions.length) {
      awardCertificate({
        category: selectedCategory,
        finalScore,
        totalQuestions: questions.length,
      });
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(10);
    setIsTimeUp(false);
    setIsQuizEnd(false);
    setUserAnswers([]);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setToken("");
    setUser(null);
    setEarnedCertificates([]);
    delete axios.defaults.headers.common["Authorization"];
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
        userAnswers,
        handleAnswer,
        handleNextQuestions,
        handleRestartQuiz,
        handleCategoryChange,
        handleLogout,
        awardCertificate,
        setToken,
        handleregister,
        handleLogin
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
