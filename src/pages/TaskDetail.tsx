import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';

interface Task {
  _id: string;
  project: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  dueDate?: string;
}

const TaskDetail: React.FC = () => {
  const { id, taskId } = useParams<{ id: string; taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<Task['status']>('To Do');
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string>('');
  const [statusSuccess, setStatusSuccess] = useState<string>('');

  const handleEditTask = () => {
    navigate(`/projects/${id}/tasks/${taskId}/edit`);
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        navigate(`/projects/${id}`);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to delete task');
        } else {
          setError('Failed to delete task');
        }
      }
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(`/tasks/${taskId}`);
        setTask(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch task details');
        } else {
          setError('Failed to fetch task details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const newStatus = event.target.value as Task['status'];
    setStatus(newStatus);
    setStatusUpdating(true);
    setStatusError('');
    setStatusSuccess('');

    try {
      await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus });
      setStatusSuccess('Status updated successfully');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setStatusError(err.response?.data?.message || 'Failed to update status');
      } else {
        setStatusError('Failed to update status');
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" sx={{ mt: 4 }}>
          Task not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {task.title}
        </Typography>
        {task.description && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}
        {/* Status Select */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="Status"
            onChange={handleStatusChange}
            disabled={statusUpdating}
          >
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        {statusUpdating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Updating status...
            </Typography>
          </Box>
        )}
        {statusError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {statusError}
          </Alert>
        )}
        {statusSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {statusSuccess}
          </Alert>
        )}
        {task.dueDate && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Due Date: {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleEditTask} sx={{ mr: 2 }}>
            Edit Task
          </Button>
          <Button variant="outlined" color="error" onClick={handleDeleteTask}>
            Delete Task
          </Button>
          {/* Return Button */}
          <Button variant="text" onClick={() => navigate(-1)} sx={{ ml: 2 }}>
            Back
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default React.memo(TaskDetail);