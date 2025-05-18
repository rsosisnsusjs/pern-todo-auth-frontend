import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const InputTodo = ({ setTodosChange }) => {
    const [description, setDescription] = useState('');
    const [detailText, setDetailText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [hourInput, setHourInput] = useState('');
    const [minuteInput, setMinuteInput] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editableDetail, setEditableDetail] = useState('');

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    const onSubmitForm = async e => {
        e.preventDefault();

        if (!description.trim() || !selectedDate) {
            alert("Please enter a task description and a due date.");
            return;
        }

        const hour = parseInt(hourInput, 10);
        const minute = parseInt(minuteInput, 10);

        if (
            isNaN(hour) || isNaN(minute) ||
            hour < 0 || hour > 23 ||
            minute < 0 || minute > 59
        ) {
            alert('Please enter valid hour (0-23) and minute (0-59).');
            return;
        }

        const combinedDateTime = selectedDate
        .hour(hour)  // Set the hour value
        .minute(minute)  // Set the minute value
        .second(0)  // Ensure seconds are zero
        .millisecond(0);

        const formattedDate = combinedDateTime.format('YYYY-MM-DD HH:mm:ss');

        // debug log ดูว่าเป็น local time หรือยัง
        console.log('Submitting date:', formattedDate);

        try {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('jwt_token', localStorage.token);

            const body = {
                description,
                due_date: combinedDateTime.format('YYYY-MM-DDTHH:mm:ssZ'),
                detail_text: detailText,
            };

            const response = await fetch('http://localhost:5000/dashboard/todos', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body),
            });

            const parseResponse = await response.json();
            console.log('Todo creation response:', parseResponse);

            if (!response.ok || !parseResponse.todo) {
                alert('Error creating Todo');
                return;
            }

            setTodosChange(true);

            // Clear form after successful submit
            setDescription('');
            setDetailText('');
            setSelectedDate(null);
            setHourInput('');
            setMinuteInput('');

            handleClose(); // Close modal after submit

        } catch (err) {
            console.error('Error in submitting form:', err.message);
            alert('Something went wrong, please try again later.');
        }
    };

        

    const minDate = dayjs().startOf('day');

    return (
        <>
            <IconButton color="dark" onClick={handleOpen} aria-label="add todo">
                <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
            </IconButton>
    
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle className="modal-title">Add New Todo</DialogTitle>
                    <form onSubmit={onSubmitForm}>
                        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className="modal-content">
                            <TextField
                                label="Todo Description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder='Add todo here...'
                                fullWidth
                                required
                                sx={{
                                    fontSize: '1.2rem',
                                    '& .MuiInputBase-input': {
                                        padding: '12px',
                                        fontSize: '1.2rem',
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '1.2rem',
                                    }
                                }}
                            />
    
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <DatePicker
                                    label="Due Date"
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    minDate={minDate}
                                    inputFormat="DD/MM/YYYY"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            sx={{
                                                flex: 1,
                                                fontSize: '1.2rem',
                                                '& .MuiInputBase-input': {
                                                    padding: '12px',
                                                    fontSize: '1.2rem',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '1.2rem',
                                                }
                                            }}
                                        />
                                    )}
                                />
    
                                <TextField
                                    type="number"
                                    label="HH"
                                    value={hourInput}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (value === '') {
                                            setHourInput('');
                                            return;
                                        }
                                        value = value.replace(/[^0-9]/g, '');
                                        let number = parseInt(value, 10);
                                        if (number > 23) number = 23;
                                        if (number < 0) number = 0;

                                        const padded = number.toString().padStart(2, '0');

                                        setHourInput(padded);
                                    }}
                                    placeholder="HH"
                                    sx={{
                                        width: '70px',
                                        fontSize: '1.2rem',
                                        '& .MuiInputBase-input': {
                                            padding: '15px',
                                            fontSize: '1.2rem',
                                            textAlign: 'center'
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontSize: '1.2rem',
                                        }
                                    }}
                                    inputProps={{ maxLength: 2 }}
                                    required
                                />

                                <span style={{ fontSize: '1.5rem' }}>:</span>

                                <TextField
                                    type="number"
                                    label="MM"
                                    value={minuteInput}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (value === '') {
                                            setMinuteInput('');
                                            return;
                                        }
                                        value = value.replace(/[^0-9]/g, '');
                                        let number = parseInt(value, 10);
                                        if (number > 59) number = 59;
                                        if (number < 0) number = 0;

                                        // ถ้าเป็นเลขหลักเดียว ➔ เติม 0 นำหน้า
                                        const padded = number.toString().padStart(2, '0');

                                        setMinuteInput(padded);
                                    }}
                                    placeholder="MM"
                                    sx={{
                                        width: '70px',
                                        fontSize: '1.2rem',
                                        '& .MuiInputBase-input': {
                                            padding: '15px',
                                            fontSize: '1.2rem',
                                            textAlign: 'center'
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontSize: '1.2rem',
                                        }
                                    }}
                                    inputProps={{ maxLength: 2 }}
                                    required
                                />

                            </div>
    
                            <TextField
                                label="Detail (optional)"
                                value={detailText}
                                onChange={(e) => setDetailText(e.target.value)}
                                placeholder='Add more details here...'
                                fullWidth
                                multiline
                                minRows={4}
                                sx={{
                                    fontSize: '1.2rem',
                                    '& .MuiInputBase-input': {
                                        padding: '12px',
                                        fontSize: '1.2rem',
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '1.2rem',
                                    }
                                }}
                            />
                        </DialogContent>
    
                        <DialogActions>
                            <Button onClick={handleClose} class="btn btn-secondary btn-sm">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" class="btn btn-dark btn-sm">
                                Add Todo
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </LocalizationProvider>
        </>
    );
    
    
};

export default InputTodo;
