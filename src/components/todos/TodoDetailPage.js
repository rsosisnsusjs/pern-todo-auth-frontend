import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircularProgress, Typography, Box, Button, Stack, IconButton, TextField } from '@mui/material';
import Notification from '../dashboard/todolist/notification';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const TodoDetailPage = ({ setAuth }) => {
    const { id } = useParams();
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editableDetail, setEditableDetail] = useState('');
    const [editableDescription, setEditableDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [allTodos, setAllTodos] = useState([]);

    const getProfile = async () => {
        try {
            const res = await fetch('http://localhost:5000/dashboard/', {
                method: 'GET',
                headers: { jwt_token: localStorage.token },
            });
            const parseData = await res.json();
            setAllTodos(parseData);
            setName(parseData[0]?.user_name || '');
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setAuth(false);
            toast.success('Logout successfully', { autoClose: 1000 });
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                const res = await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'jwt_token': localStorage.token,
                    }
                });
                if (res.ok) {
                    toast.success('Todo deleted successfully');
                    navigate('/dashboard');
                } else {
                    toast.error('Failed to delete todo');
                }
            } catch (err) {
                console.error('Error deleting todo:', err);
            }
        }
    };

    const fetchTodo = async () => {
        try {
            const res = await fetch(`http://localhost:5000/dashboard/todos/${id}/details`, {
                method: 'GET',
                headers: {
                    'jwt_token': localStorage.token,
                }
            });
            const data = await res.json();
            if (res.ok) {
                setTodo(data);
                setEditableDescription(data.description);
                setEditableDetail(data.detail_text || '');
                setSelectedDate(dayjs(data.due_date));
            } else {
                console.error('Todo not found');
            }
        } catch (err) {
            console.error('Error fetching todo:', err);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = () => {
        setEditMode(true);
    };

    const saveEdit = async () => {
        try {
            const updatedTodo = {
                description: editableDescription,
                detail_text: editableDetail,
                due_date: selectedDate.toISOString(),
            };

            const res = await fetch(`http://localhost:5000/dashboard/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'jwt_token': localStorage.token,
                },
                body: JSON.stringify(updatedTodo),
            });

            if (res.ok) {
                const updated = await res.json();
                setTodo({
                    ...todo,
                    description: updated.description,
                    detail_text: updated.detail_text,
                    due_date: updated.due_date,
                });
                setEditMode(false);
            } else {
                toast.error('Update failed');
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getProfile();
        fetchTodo();
    }, [id]);

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;

    if (!todo) return <Typography variant="h5" color="error" align="center" mt={5}>Todo not found.</Typography>;

    return (
        <div>
            {/* Header Section */}
            <header className="d-flex justify-content-between align-items-center p-4 bg-light border-bottom">
                <h2 className="todo-list-header">
                    <strong>{name}'s Todo List</strong>
                </h2>

                <div className="d-flex align-items-center">
                    <Link to='/summary' className='btn btn-outline-secondary'>Summary</Link>
                    <Link to='/dashboard' className='btn btn-outline-secondary'>Todo list</Link>
                    <Notification todos={allTodos} />
                    <button onClick={handleLogout} className="btn btn-dark ml-3">
                        Logout
                    </button>
                </div>
            </header>

            <Box p={4} sx={{ textAlign: 'left' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">
                        <strong>Todo:</strong> {todo.description}
                    </Typography>
                    <IconButton onClick={handleDelete} color="dark">
                        <DeleteIcon />
                    </IconButton>
                </Box>

                <Typography variant="h5" mt={3}>
                    <strong>Detail:</strong>{' '}
                    {editMode ? (
                        <>
                            <TextField
                                value={editableDetail}
                                onChange={(e) => setEditableDetail(e.target.value)}
                                multiline
                                fullWidth
                                minRows={2}
                                sx={{
                                    '& .MuiInputBase-input': {
                                    fontSize: '1.5rem',
                                    },
                                }}
                            />
                            <IconButton onClick={saveEdit} color="dark">
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={() => setEditMode(false)} color="dark">
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            {todo.detail_text || 'No detail'}
                            <IconButton onClick={startEdit} size="small">
                                <EditIcon fontSize="medium" />
                            </IconButton>
                        </>
                    )}
                </Typography>

                <Typography variant="h5" mt={2}>
                    <strong>Due Date:</strong>{' '}
                    {editMode ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={selectedDate}
                                onChange={setSelectedDate}
                                renderInput={(params) => <TextField {...params} />}
                                minDate={dayjs()}
                            />
                        </LocalizationProvider>
                    ) : (
                        dayjs(todo.due_date).format('DD/MM/YYYY HH:mm')
                    )}
                </Typography>

                <Box display="flex" justifyContent="center" mt={6}>
                    <Link to="/dashboard" className="btn btn-dark">Back</Link>
                </Box>
            </Box>
        </div>
    );
};

export default TodoDetailPage;
