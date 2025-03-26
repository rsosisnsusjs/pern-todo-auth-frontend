import React, { useState, useEffect } from 'react';

const EditTodo = ({ todo, setTodosChange }) => {
  const [description, setDescription] = useState(todo.description);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    setDescription(todo.description);
    setDueDate(todo.due_date ? new Date(todo.due_date).toISOString().slice(0, 16) : '');
  }, [todo]);

  const getCurrentDateTime = () => {
    return new Date().toISOString().slice(0, 16);
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    try {
      const body = { description, due_date: dueDate };

      console.log("Updating Todo:", body);

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('jwt_token', localStorage.token);

      const response = await fetch(`http://localhost:5000/dashboard/todos/${todo.todo_id}`, {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setTodosChange(true);
      } else {
        console.error('Failed to update todo');
      }
    } catch (err) {
      console.error(err.message);
    }
  };


  
  return (
    <>
      <button
        type="button"
        className="btn btn-warning btn-sm"
        data-toggle="modal"
        data-target={`#id${todo.todo_id}`}
      >
        Edit
      </button>

      <div className="modal fade" id={`id${todo.todo_id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Todo</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label>Description:</label>
              <input
                type="text"
                className="form-control mb-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Due Date:</label>
              <input
                type="datetime-local"
                className="form-control"
                value={dueDate}
                min={getCurrentDateTime()}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={updateTodo}>
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-dark"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTodo;
