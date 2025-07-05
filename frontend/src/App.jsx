import {Route,Routes} from 'react-router-dom';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
//import Header from './components/Header';
//import Modal from './components/Modal';
import {ToastContainer} from 'react-toastify';



const App = () => {
  return (
    <div>
     <ToastContainer/>
     <NavBar/>
     <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/quiz' element={<Quiz/>}/>
     </Routes>
     <Footer/>  
    </div>
  )
}

export default App
