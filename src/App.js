//import logo from './logo.svg';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
//import Navbar from './Components/Navbar';
//import Hero from './Components/Hero';
//import Footer from './Components/Footer';
import './Components/LoginSignUp.css';
import LoginSignUp from './Components/LoginSignUp';
import './App.css';
import OwnerDashboard from './Components/OwnerDashboard';

function App() {
  return (
    
    <Router>
      
          
          
      <Routes> 
         
        <Route path='/' element={<LoginSignUp/>}/>
        <Route path='/owner' element={<OwnerDashboard/>}/>
      </Routes>
      
    </Router>
  );
}

export default App;
