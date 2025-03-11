import React , { useEffect, useState } from 'react';

import EditTodo from './editTodo';

const ListTodos = ({ allTodos, setTodosChange }) => {
    console.log(allTodos);
    const [todos, setTodos] = useState([allTodos]);

    const getTodos = async () => {
        try {
            const response = await fetch('http://localhost:5000/todos');
            const jsonData = await response.json()

            setTodos(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }
    const deleteTodo = async (id) => {
        try {
            const deleteTodo = await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
                method: 'DELETE',
                headers: {jwt_token: localStorage.token}
            });

            setTodos(todos.filter(todo => todo.todo_id !== id));

        } catch (err) {
            console.error(err.message);
        }
    }


    useEffect(() => {
        setTodos(allTodos);
    }, [allTodos])


    console.log(todos);


    return <>
        <table className='table  mt-5 text-center'>
        <thead>
        <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
        </tr>
        </thead>
        <tbody>
            {/* <tr>
                <td>John</td>
                <td>Doe</td>
                <td>john@example.com</td>
                </tr>
            */}
            {todos.length !== 0 && todos[0].todo_id !== null && todos.map(todo => (
               <tr key={todo.todo_id}>
                    <td>{todo.description}</td>
                    <td><EditTodo todo={todo} setTodosChange={setTodosChange}/></td>
                    <td>
                        <button className='btn btn-danger' onClick={() => deleteTodo(todo.todo_id)}>Delete</button>
                    </td>
               </tr> 
            ))}
        
        </tbody>
    </table>
  </>;
}

export default ListTodos;