import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });

  const { email, password } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  
  const getUrgentTodos = async (token) => {
    try {

        const response = await fetch('http://localhost:5000/dashboard/', {
            method: 'GET',
            headers:{
              "Content-Type": "application/json",
              jwt_token: localStorage.token,
            },
        })

        const todos = await response.json();


        const urgentTodos = todos.filter(todo => {
            if (!todo.due_date) return false;
            const dueDate = new Date(todo.due_date);
            const now = new Date();
            return dueDate - now < 24 * 60 * 60 * 1000; // เหลือน้อยกว่า 1 วัน
        });

        if (urgentTodos.length > 0) {
            urgentTodos.forEach(todo => {

              const dueDate = new Date(todo.due_date);
              const now = new Date();
              const isOverdue = dueDate < now;
              
              if (isOverdue) {
                toast.error(`Task "${todo.description}" is overdue!`, {
                    autoClose: false,
                    closeOnClick: true,
                });
            } else {
                toast.warning(`Task "${todo.description}" is due soon!`, {
                    autoClose: false,
                    closeOnClick: true,
                });
            }
            })
        }
    } catch (err) {
        console.error('Error fetching todos:', err.message);
    }
};




  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch(
        'http://localhost:5000/authentication/login',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      )

      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem('token', parseRes.jwtToken);
        setAuth(true);
        toast.success('Logged in Successfully', {autoClose: 1000});

        await getUrgentTodos(parseRes.jwtToken);

      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <h1 className='login-header mt-5 text-center'><strong>LOGIN</strong></h1>
      <form onSubmit={onSubmitForm}>
        <input
          type='text'
          name='email'
          value={email}
          onChange={e => onChange(e)}
          className='form-control my-3'
        />
        <input
          type='password'
          name='password'
          value={password}
          onChange={e => onChange(e)}
          className='form-control my-3'
        />
        <button className='btn btn-dark btn-block'>Submit</button>
      </form>
      <Link to='/register'>register</Link>
    </>
  )
}

export default Login;