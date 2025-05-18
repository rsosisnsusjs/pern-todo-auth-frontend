import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const EditTodo = ({ todo, setTodosChange }) => {
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState('');
  const [detailText, setDetailText] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [hourInput, setHourInput] = useState('');
  const [minuteInput, setMinuteInput] = useState('');

  useEffect(() => {
    setDescription(todo.description);
    setDetailText(todo.detail || '');
    const due = new Date(todo.due_date);
    setSelectedDate(dayjs(due));
    setHourInput(due.getHours().toString().padStart(2, '0'));
    setMinuteInput(due.getMinutes().toString().padStart(2, '0'));
  }, [todo]);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const updatedDate = selectedDate
        .hour(parseInt(hourInput, 10))
        .minute(parseInt(minuteInput, 10))
        .second(0)
        .millisecond(0);

      const body = {
        description,
        detail_text: detailText,
        due_date: updatedDate.toISOString(),
      };

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
        handleClose();
      } else {
        console.error('Failed to update todo');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <IconButton size="small" aria-label="edit" onClick={handleOpen}>
        <EditIcon fontSize="small" />
      </IconButton>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle className="modal-title">Edit Todo</DialogTitle>
          <form onSubmit={onSubmitForm}>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className="modal-content">
              <TextField
                label="Todo Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Edit todo here...'
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
                  minDate={dayjs()}
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
                    if (value === '') return setHourInput('');
                    value = value.replace(/[^0-9]/g, '');
                    let number = Math.min(23, Math.max(0, parseInt(value, 10)));
                    setHourInput(number.toString().padStart(2, '0'));
                  }}
                  placeholder="HH"
                  sx={{
                    width: '70px',
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
                    if (value === '') return setMinuteInput('');
                    value = value.replace(/[^0-9]/g, '');
                    let number = Math.min(59, Math.max(0, parseInt(value, 10)));
                    setMinuteInput(number.toString().padStart(2, '0'));
                  }}
                  placeholder="MM"
                  sx={{
                    width: '70px',
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
                placeholder='Edit detail here...'
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
               <Button
                onClick={handleClose}
                sx={{
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  padding: '8px 16px',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#5a6268', 
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#343a40',
                  color: 'white', 
                  padding: '8px 16px',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#23272b', 
                  },
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </LocalizationProvider>
    </>
  );
};

export default EditTodo;
