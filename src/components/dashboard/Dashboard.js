import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputTodo from './todolist/inputTodo';
import ListTodos from './todolist/listTodos';
import DoneTodos from "./todolist/doneTodos";
import Notification from './todolist/notification';

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState('');
  const [allTodos, setAllTodos] = useState([]);
  const [todosChange, setTodosChange] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState("todos");
  

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
      toast.success('Logout successfully', {autoClose: 1000});
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
        <h2 className="todo-list-header">
          <strong>{name}'s Todo List</strong>
        </h2>

        

        <div className="d-flex align-items-center">
          {/* View Toggle Buttons */}
          <Link to='/summary' className='btn btn-outline-secondary'>Summary</Link>
          <button
            className={`btn btn-outline-secondary mx-2`}
            onClick={() => setView("todos")}
          >
            Todos
          </button>
          <button
            className={`btn btn-outline-secondary mx-2`}
            onClick={() => setView("done")}
          >
            Done Todos
          </button>

          {/* Search Bar */}
          <input
            type="text"
            className="form-control mx-2"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Notification todos={allTodos} />

          {/* Logout Button */}
          <button onClick={handleLogout} className="btn btn-dark ml-3">
            Logout
          </button>
        </div>
      </header>


      {/* Main Content */}
      <main className="p-3">
        {view === "todos" ? (
          <>
            <InputTodo setTodosChange={setTodosChange} />
            <ListTodos
              allTodos={allTodos.filter(todo =>
                todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              setTodosChange={setTodosChange}
            />
          </>
        ) : (
          <DoneTodos
            allTodos={allTodos.filter(todo =>
              todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            setTodosChange={setTodosChange}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
