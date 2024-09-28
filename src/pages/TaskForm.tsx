import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { formatDateToInput } from '../utils/dateUtils';

interface TaskFormData {
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  dueDate?: string;
}

const TaskForm: React.FC  = () => {
  const navigate = useNavigate();
  const { id, taskId } = useParams<{ id: string; taskId?: string }>();
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'To Do',
    dueDate: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const isEditMode = Boolean(taskId);

  useEffect(() => {
    if (isEditMode) {
      const fetchTask = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/tasks/${taskId}`);
          setFormData({ ...response.data, dueDate: formatDateToInput(response.data.dueDate) });
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Failed to fetch task data');
          } else {            
            setError('Failed to fetch task data');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [isEditMode, taskId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {        
        await axiosInstance.put(`/tasks/${taskId}`, {
          description: formData.description,
          dueDate: formData.dueDate,
          status: formData.status,
          title: formData.title
        });
      } else {
        await axiosInstance.post(`/tasks`, { ...formData, project: id });
      }
      navigate(`/projects/${id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to save task');
      } else {            
        setError('Failed to save task');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {isEditMode ? 'Edit Task' : 'Create Task'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              margin="normal"
              slotProps={{inputLabel: {
                shrink: true,
              }}}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {isEditMode ? 'Update Task' : 'Create Task'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default React.memo(TaskForm);