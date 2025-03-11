import React, { useState } from 'react';

const EditTodo = ({ todo, setTodosChange }) => {

    const [description, setDescription] = useState(todo.description);


    // edit description
    const updateDescription = async (e) => {
        e.preventDefault();
        try {
            const body = { description };

            const myHeaders = new Headers();
            
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('jwt_token', localStorage.token);

            const response = await fetch(`http://localhost:5000/dashboard/todos/${todo.todo_id}`, {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(body)
            })

            setTodosChange(true);

            //window.location = '/';
        } catch (err) {
            console.error(err.message);
        }
    }

    return (<>
        <button
            type="button"
            className="btn btn-warning"
            data-toggle="modal"
            data-target={`#id${todo.todo_id}`}
        >
            Edit
        </button>
        
        <div className="modal fade" id={`id${todo.todo_id}`} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Edit Todo</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setDescription(todo.description)}>
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <input type='text' className='form-control' value={description} onChange={e => setDescription(e.target.value)}/>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={e => updateDescription(e)}>Edit</button>
                <button type="button" className="btn btn-dark" data-dismiss="modal" onClick={() => setDescription(todo.description)}>Close</button>
            </div>
            </div>
        </div>
        </div>
    </>)
}

export default EditTodo;