import React, { useEffect, useState } from 'react';

const DoneTodos = () => {
  const [doneTodos, setDoneTodos] = useState([]);
  const [selectedTodos, setSelectedTodos] = useState([]);  // สถานะของงานที่ถูกเลือก

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

  // ฟังก์ชันสำหรับเลือกหรือยกเลิกการเลือกงาน
  const handleCheckboxChange = (id) => {
    setSelectedTodos((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((todoId) => todoId !== id)  // ถ้ามีการยกเลิกเลือก
        : [...prevSelected, id]  // ถ้าเลือกใหม่
    );
  };

  // ฟังก์ชันลบงานที่เลือกทั้งหมด
  const deleteSelectedTodos = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete the selected tasks?');
    if (!confirmDelete) return;

    try {
      // ลบงานทีละงาน
      for (const todoId of selectedTodos) {
        const response = await fetch(`http://localhost:5000/dashboard/done/${todoId}`, {
          method: 'DELETE',
          headers: { jwt_token: localStorage.token },
        });

        if (response.ok) {
          setDoneTodos((prevTodos) => prevTodos.filter((todo) => todo.todo_id !== todoId));  // อัปเดตข้อมูลหลังลบ
        } else {
          console.error('Failed to delete done todo:', await response.text());
        }
      }

      // รีเซ็ตการเลือกหลังจากลบ
      setSelectedTodos([]);
    } catch (err) {
      console.error('Error deleting selected todos:', err.message);
    }
  };

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

      {/* ปุ่มลบงานที่เลือก */}
      {selectedTodos.length > 0 && (
        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-danger" onClick={deleteSelectedTodos}>
            Delete Selected
          </button>
        </div>
      )}

      <table className='table text-center'>
        <thead className='thead-dark'>
          <tr>
            <th className='text-center'>
              <input
                type="checkbox"
                onChange={() =>
                  selectedTodos.length === doneTodos.length
                    ? setSelectedTodos([])  // ถ้าเลือกครบทุกงานแล้ว ให้ยกเลิกการเลือกทั้งหมด
                    : setSelectedTodos(doneTodos.map(todo => todo.todo_id))  // เลือกทั้งหมด
                }
                checked={selectedTodos.length === doneTodos.length}
              />
            </th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTodos.includes(todo.todo_id)}
                    onChange={() => handleCheckboxChange(todo.todo_id)}  // เลือกหรือยกเลิกการเลือก
                  />
                </td>
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
              <td colSpan='5' className='text-center text-muted'>
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
