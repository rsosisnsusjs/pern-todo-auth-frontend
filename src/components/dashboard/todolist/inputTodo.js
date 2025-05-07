import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const InputTodo = ({ setTodosChange }) => {
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);

    const onSubmitForm = async e => {
        e.preventDefault();

        if (!description.trim() || !dueDate) {
            alert("Please enter a task description and a due date.");
            return;
        }

        try {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('jwt_token', localStorage.token);

            const body = {
                description,
                due_date: dueDate.toISOString(), // แปลง dayjs เป็น ISO string
            };

            const response = await fetch('http://localhost:5000/dashboard/todos', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body),
            });

            const parseResponse = await response.json();
            console.log(parseResponse);
            setTodosChange(true);
            setDescription('');
            setDueDate(null);
        } catch (err) {
            console.error(err.message);
        }
    };

    const minDateTime = dayjs().add(5, 'minute');

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form className='d-flex flex-row align-items-center gap-3 mt-5' onSubmit={onSubmitForm}>
                <input
                    type='text'
                    name='description_input'
                    className='form-control mb-2'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder='add todo here...'
                />

                <DateTimePicker
                label="Due Date"
                name="due_date_input"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                minDateTime={minDateTime}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    className="form-control mb-2 w-25 ml-2"
                    sx={{
                        '& .MuiInputBase-input': {
                        padding: '10px 12px',
                        fontSize: '1rem',
                        },
                        '& .MuiInputLabel-root': {
                        fontSize: '0.95rem',
                        }
                    }}
                    />
                )}
                slotProps={{
                    textField: { size: 'small' },
                    desktopPaper: {
                    sx: {
                        '& .MuiPickersToolbar-root': {
                        fontSize: '1.2rem',
                        },
                        '& .MuiPickersCalendarHeader-label': {
                        fontSize: '1.1rem',
                        },
                        '& .MuiPickersDay-dayWithMargin': {
                        fontSize: '1.1rem',
                        },
                        '& .MuiPickersClockNumber-root': {
                        fontSize: '1.1rem',
                        }
                    }
                    }
                }}
/>

                <button className='btn btn-dark mb-2 ml-2' name='add_button'>Add</button>
            </form>
        </LocalizationProvider>
    );
};

export default InputTodo;
