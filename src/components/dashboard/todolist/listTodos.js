import React, { useEffect, useState } from "react";
import EditTodo from "./editTodo";

const ListTodos = ({ allTodos, setTodosChange }) => {
  const [todos, setTodos] = useState([]);
  const [doneTodos, setDoneTodos] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');

  const deleteTodo = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
        method: "DELETE",
        headers: { jwt_token: localStorage.token },
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.todo_id !== id));
      } else {
        console.error("Failed to delete todo:", await response.text());
      }
    } catch (err) {
      console.error("Error deleting todo:", err.message);
    }
  };

  const markAsDone = async (todo) => {
    if (!todo || !todo.todo_id) return;

    try {
      const response = await fetch(`http://localhost:5000/dashboard/done`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          jwt_token: localStorage.token,
        },
        body: JSON.stringify({
          todo_id: todo.todo_id,
          description: todo.description,
          due_date: todo.due_date,
        }),
      });

      if (response.ok) {
        setTodos(todos.filter((t) => t.todo_id !== todo.todo_id));
        setDoneTodos([...doneTodos, todo]);
      } else {
        console.error("Failed to mark as done:", await response.text());
      }
    } catch (err) {
      console.error("Error marking as done:", err.message);
    }
  };
  
  useEffect(() => {
    setTodos(allTodos || []); 
  }, [allTodos]);

  const filteredAndSortedTodos = todos
    .filter((todo) =>
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((todo) => todo.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));; // Sort todos by due date

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return { timeText: "Invalid Date", color: "black" };

    const now = new Date();
    const due = new Date(dueDate);
    const timeRemaining = due - now;

    if (timeRemaining < 0) {
      return { timeText: "Overdue", color: "gray" }; // Show "Overdue" for past due dates
    }

    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    const hoursRemaining = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    const minutesRemaining = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    let color = "black";

    /*
    if (timeRemaining < 60 * 60 * 1000) {
      color = "red"; // Red for urgent tasks
      return { timeText: `${minutesRemaining}m !!`, color };
    }
      */

    if (timeRemaining < 24 * 60 * 60 * 1000) {
      color = "red"; // Red for urgent tasks
      return { timeText: `${hoursRemaining}h ${minutesRemaining}m !!`, color };
    } else if (timeRemaining < 3 * 24 * 60 * 60 * 1000) {
      color = "orange"; // Orange for near deadlines
    }

    return { timeText: `${daysRemaining}d ${hoursRemaining}h`, color };
  };

  return (
    <>

      {/* Todo List */}
      <table className="table mt-5 text-center">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">Description</th>
            <th className="text-center">Due Date</th>
            <th className="text-center">Time Remaining</th>
            <th className="text-center">Edit</th>
            <th className="text-center">Done</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedTodos.length > 0 ? (
            filteredAndSortedTodos.map((todo) => {
              const { timeText, color } = getTimeRemaining(todo.due_date);
              return (
                <tr key={todo.todo_id}>
                  <td>{todo.description}</td>
                  <td>
                    {new Date(todo.due_date).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td style={{ color }}>{timeText}</td>
                  <td>
                    <EditTodo todo={todo} setTodosChange={setTodosChange} />
                  </td>
                  <td>
                  <button
                    className="btn btn-success"
                    onClick={() => markAsDone(todo)} 
                  >
                    Done
                  </button>
                </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTodo(todo.todo_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ListTodos;
