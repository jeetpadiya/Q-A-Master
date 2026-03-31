import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz'
import Login from './pages/login';
import Register from './pages/register';
//import Header from './components/Header';
//import Modal from './components/Modal';
import { ToastContainer } from 'react-toastify';
import { QuizContext } from './context/QuizContext';
import { useContext } from 'react';


const App = () => {

  const { token } = useContext(QuizContext)
  return (
    <div>
      <ToastContainer />
      {token ? (
        <>
          <NavBar />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/quiz' element={<Quiz />} />
            <Route path='/login' element={<Navigate to='/' replace />} />
            <Route path='/register' element={<Navigate to='/' replace />} />
          </Routes>
          <Footer />
        </>
      ):(
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='/quiz' element={<Navigate to='/login' replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      )}
    </div>
  )
}

export default App
