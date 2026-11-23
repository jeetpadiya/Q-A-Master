import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import AdaptiveQuiz from './pages/AdaptiveQuiz';
import SpotTheBug from './pages/SpotTheBug';
import Login from './pages/login';
import Register from './pages/register';
import { Toaster } from 'sonner';
import { QuizContext } from './context/QuizContext';
import { useContext } from 'react';

const App = () => {
  const { token } = useContext(QuizContext);

  return (
    <div>
      <Toaster richColors position="top-right" theme="dark" />
      {token ? (
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/adaptive" element={<AdaptiveQuiz />} />
            <Route path="/spot-the-bug" element={<SpotTheBug />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/quiz" element={<Navigate to="/login" replace />} />
          <Route path="/adaptive" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
