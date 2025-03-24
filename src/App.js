import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/dashboard/Dashboard';
import Landing from './components/Landing';
import SummaryPage from "./components/dashboard/todolist/summaryTodos";

function App() {
  console.log("App component loaded");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthenticated = async () => {
    try {
      const res = await fetch('http://localhost:5000/authentication/verify', {
        method: 'POST',
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json();

      setIsAuthenticated(parseRes === true);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <Router>
      <div className='container'>
        <Routes>
          <Route path='/' element={!isAuthenticated ? <Landing /> : <Navigate to='/dashboard' />} />
          <Route path='/login' element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to='/dashboard' />} />
          <Route path='/register' element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to='/dashboard' />} />
          <Route path='/dashboard' element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to='/login' />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
