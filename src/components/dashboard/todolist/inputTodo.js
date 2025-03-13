import React, { useState } from 'react';

const InputTodo = ({ setTodosChange }) => {
    const [description, setDescription] = useState('');
    const [due_date, setDueDate] = useState('');

    const onSubmitForm = async e => {
        e.preventDefault();

        if (!description.trim() || !due_date) {
            alert("Please enter a task description and a due date.");
            return;
        }

        try {

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('jwt_token', localStorage.token);

            const body = { description, due_date };
            const response = await fetch('http://localhost:5000/dashboard/todos', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            })
            
            const parseResponse = await response.json();
            console.log(parseResponse);
            setTodosChange(true);
            setDescription('');
            setDueDate('');
        } catch (err) {
            console.error(err.message);
        }
    }

    const minDateTime = new Date();
    minDateTime.setMinutes(minDateTime.getMinutes() + 5);
    const minDateTimeISO = minDateTime.toISOString().slice(0, 16);

    return (
        <>
        <form className='d-flex flex-row align-items-center gap-3 mt-5' onSubmit={onSubmitForm}>
            <input
                type='text'
                className='form-control mb-2'
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='add todo here...'/>
            <input 
                type="datetime-local"
                className="form-control mb-2 w-25 p-3 ml-2"
                value={due_date}
                onChange={e => setDueDate(e.target.value)}
                min={minDateTimeISO}
                />
            
            <button className='btn btn-dark mb-2 ml-2'>Add</button>
        </form>
        </>
    )
}

export default InputTodo;