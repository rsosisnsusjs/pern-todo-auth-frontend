import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InputTodo from './todolist/inputTodo';
import ListTodos from './todolist/listTodos';
import Notification from './todolist/notification';

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState('');
  const [allTodos, setAllTodos] = useState([]);
  const [todosChange, setTodosChange] = useState(false);

  const getProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/dashboard/', {
        method: 'GET',
        headers: { jwt_token: localStorage.token },
      });

      const parseData = await res.json();

      setAllTodos(parseData);
      setName(parseData[0]?.user_name || '');
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setAuth(false);
      toast.success('Logout successfully');
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
    setTodosChange(false);
  }, [todosChange]);

  return (
    <div>
      {/* Header Section */}
      <header className="d-flex justify-content-between align-items-center p-4 bg-light border-bottom">
        <h2>{name}'s Todo List</h2>
        <div className="d-flex align-items-center">
          <Notification todos={allTodos} />
          <button onClick={handleLogout} className="btn btn-dark ml-3">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-3">
        <InputTodo setTodosChange={setTodosChange} />
        <ListTodos allTodos={allTodos} setTodosChange={setTodosChange} />
      </main>
    </div>
  );
};

export default Dashboard;
