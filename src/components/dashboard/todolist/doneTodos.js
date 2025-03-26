import React, { useEffect, useState } from 'react';

const DoneTodos = () => {
  const [doneTodos, setDoneTodos] = useState([]);

  useEffect(() => {
    const fetchDoneTodos = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard/done', {
          method: 'GET',
          headers: { jwt_token: localStorage.token },
        });

        const data = await response.json();
        setDoneTodos(data);
      } catch (err) {
        console.error('Error fetching done todos:', err.message);
      }
    };

    fetchDoneTodos();
  }, []);

  // ฟังก์ชันลบงานแต่ละงาน
  const deleteDoneTodo = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/dashboard/done/${id}`, {
        method: 'DELETE',
        headers: { jwt_token: localStorage.token },
      });

      if (response.ok) {
        setDoneTodos(doneTodos.filter((todo) => todo.todo_id !== id));
      } else {
        console.error('Failed to delete done todo:', await response.text());
      }
    } catch (err) {
      console.error('Error deleting done todo:', err.message);
    }
  };

  return (
    <div className='mt-5'>
      <h2 className='text-center mb-5'><strong>Completed Todos</strong></h2>

      <table className='table text-center'>
        <thead className='thead-dark'>
          <tr>
            <th className='text-center'>Description</th>
            <th className='text-center'>Due Date</th>
            <th className='text-center'>Status</th>
            <th className='text-center'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(doneTodos) && doneTodos.length > 0 ? (
            doneTodos.map((todo) => (
              <tr key={todo.todo_id}>
                <td>{todo.description}</td>
                <td>
                  {new Date(todo.due_date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </td>
                <td className='text-success'>Done</td>
                <td>
                  <button
                    className='btn btn-danger'
                    onClick={() => deleteDoneTodo(todo.todo_id)}  // ลบงานที่เลือก
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4' className='text-center text-muted'>
                No completed tasks
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoneTodos;
