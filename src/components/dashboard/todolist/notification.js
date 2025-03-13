import React, { useState } from 'react';

const Notification = ({ todos }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeRemaining = due - now;

    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return {
      daysRemaining,
      hoursRemaining,
      isUrgent: timeRemaining < 24 * 60 * 60 * 1000,
      isSoon: timeRemaining < 3 * 24 * 60 * 60 * 1000,
    };
  };

  const filteredTodos = todos
    .filter((todo) => todo.due_date) // Filter todos with valid due dates
    .filter((todo) => {
      const { daysRemaining } = getTimeRemaining(todo.due_date);
      return daysRemaining < 3; // Include todos with deadlines within 3 days
    });

  return (
    <div className='position-relative'>
      {/* Notification Icon */}
      <button
        className='btn btn-light position-relative'
        onClick={toggleDropdown}
        style={{ cursor: 'pointer' }}
      >
        <img
          src='/notification.png' // Replace with the correct path
          alt='Notification'
          style={{ width: '24px', height: '24px' }}
        />
        {filteredTodos.length > 0 && (
          <span className='badge badge-danger position-absolute top-0 start-100 translate-middle'>
            {filteredTodos.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className='dropdown-menu show p-3 shadow'
          style={{
            position: 'absolute',
            left: 0, // Align dropdown to the left
            top: '100%',
            zIndex: 1050,
            display: 'block',
          }}
        >
          <h6 className='dropdown-header'>Upcoming Deadlines</h6>
          {filteredTodos.length > 0 ? (
            <ul className='list-unstyled'>
              {filteredTodos.map((todo) => {
                const { daysRemaining, hoursRemaining, isUrgent, isSoon } =
                  getTimeRemaining(todo.due_date);

                const color = isUrgent
                  ? 'text-danger'
                  : isSoon
                  ? 'text-warning'
                  : 'text-dark';

                return (
                  <li key={todo.todo_id} className={`mb-2 ${color}`}>
                    {todo.description} - {daysRemaining}d {hoursRemaining}h
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className='text-muted'>No upcoming deadlines</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
