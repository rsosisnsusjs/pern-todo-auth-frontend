import React, { useEffect, useState } from "react";
import EditTodo from "./editTodo";

const ListTodos = ({ allTodos, setTodosChange }) => {
  const [todos, setTodos] = useState([]);

  const deleteTodo = async (id) => {
    if (!id) {
      console.error("Invalid todo_id: ", id);
      return; // Prevent delete request if id is null/undefined
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
        method: "DELETE",
        headers: { jwt_token: localStorage.token },
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.todo_id !== id)); // Update state
      } else {
        console.error("Failed to delete todo:", await response.text());
      }
    } catch (err) {
      console.error("Error deleting todo:", err.message);
    }
  };

  useEffect(() => {
    setTodos(allTodos || []); // Initialize with empty array if allTodos is undefined
  }, [allTodos]);

  const sortedTodos = todos
    .filter((todo) => todo.due_date) // Skip todos with missing or null due_date
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)); // Sort todos by due date

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

    let color = "black";
    if (timeRemaining < 24 * 60 * 60 * 1000) {
      color = "red"; // Red for urgent tasks
      return { timeText: `${daysRemaining}d ${hoursRemaining}h !!`, color };
    } else if (timeRemaining < 3 * 24 * 60 * 60 * 1000) {
      color = "orange"; // Orange for near deadlines
    }

    return { timeText: `${daysRemaining}d ${hoursRemaining}h`, color };
  };

  return (
    <>
      <table className="table mt-5 text-center">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">Description</th>
            <th className="text-center">Due Date</th>
            <th className="text-center">Time Remaining</th>
            <th className="text-center">Edit</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => {
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
