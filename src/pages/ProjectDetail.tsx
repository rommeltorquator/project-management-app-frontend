import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import {Container, Box, Typography, Button, CircularProgress, Alert, IconButton, Link, Grid2 } from "@mui/material"

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Project {
  _id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;
  tasks?: Task[];
}

interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const handleEditProject = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axiosInstance.delete(`/projects/${id}`);
        navigate('/projects');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to delete project');
        } else {
          setError('Failed to delete project');
        }
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        setProject((prevProject) => {
          if (!prevProject) return prevProject;
          return {
            ...prevProject,
            tasks: prevProject.tasks?.filter((task) => task._id !== taskId),
          };
        });
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
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${id}`);
        const projectData = response.data;

        // Fetch tasks for the project
        const tasksResponse = await axiosInstance.get(`/tasks/project/${id}`);
        projectData.tasks = tasksResponse.data;

        // Group tasks by status
        const tasks = projectData.tasks || [];
        setTodoTasks(tasks.filter((task: { status: string; }) => task.status === 'To Do'));
        setInProgressTasks(tasks.filter((task: { status: string; }) => task.status === 'In Progress'));
        setCompletedTasks(tasks.filter((task: { status: string; }) => task.status === 'Completed'));

        setProject(projectData);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch projects');
        } else {
          setError('Failed to fetch project details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [id]);

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

  if (!project) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" sx={{ mt: 4 }}>
          Project not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {project.title}
        </Typography>
        {project.description && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {project.description}
          </Typography>
        )}
        {project.startDate && (
          <Typography variant="body2">
            Start Date: {new Date(project.startDate).toLocaleDateString()}
          </Typography>
        )}
        {project.endDate && (
          <Typography variant="body2">
            End Date: {new Date(project.endDate).toLocaleDateString()}
          </Typography>
        )}
        {project.priority && (
          <Typography variant="body2">Priority: {project.priority}</Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleEditProject} sx={{ mr: 2 }}>
            Edit Project
          </Button>
          <Button variant="outlined" color="error" onClick={handleDeleteProject}>
            Delete Project
          </Button>          
          <Button variant="text" onClick={() => navigate('/projects')} sx={{ ml: 2 }}>
            Back to Projects
          </Button>
        </Box>

        {/* Display the tasks */}
        {project.tasks && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Tasks
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/projects/${id}/tasks/new`)}
              sx={{ mb: 2 }}
            >
              Add Task
            </Button>
            {project.tasks.length === 0 ? (
              <Typography variant="body1">No tasks found.</Typography>
            ) : (
              <Grid2 container spacing={2}>
                {/* To Do Column */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Box sx={{ backgroundColor: '#f0f0f0', p: 2, borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      To Do
                    </Typography>
                    {todoTasks.length === 0 ? (
                      <Typography variant="body2">No tasks.</Typography>
                    ) : (
                      todoTasks.map((task) => (
                        <Box key={task._id} sx={{ mb: 2 }}>
                          <Link
                            component={RouterLink}
                            to={`/projects/${id}/tasks/${task._id}`}
                            underline="hover"
                            color="inherit"
                          >
                            {task.title}
                          </Link>
                          <IconButton
                            edge="end"
                            onClick={() =>
                              navigate(`/projects/${id}/tasks/${task._id}/edit`)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))
                    )}
                  </Box>
                </Grid2>

                {/* In Progress Column */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Box sx={{ backgroundColor: '#f0f0f0', p: 2, borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      In Progress
                    </Typography>
                    {inProgressTasks.length === 0 ? (
                      <Typography variant="body2">No tasks.</Typography>
                    ) : (
                      inProgressTasks.map((task) => (
                        <Box key={task._id} sx={{ mb: 2 }}>
                          <Link
                            component={RouterLink}
                            to={`/projects/${id}/tasks/${task._id}`}
                            underline="hover"
                            color="inherit"
                          >
                            {task.title}
                          </Link>
                          <IconButton
                            edge="end"
                            onClick={() =>
                              navigate(`/projects/${id}/tasks/${task._id}/edit`)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))
                    )}
                  </Box>
                </Grid2>

                {/* Completed Column */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Box sx={{ backgroundColor: '#f0f0f0', p: 2, borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Completed
                    </Typography>
                    {completedTasks.length === 0 ? (
                      <Typography variant="body2">No tasks.</Typography>
                    ) : (
                      completedTasks.map((task) => (
                        <Box key={task._id} sx={{ mb: 2 }}>
                          <Link
                            component={RouterLink}
                            to={`/projects/${id}/tasks/${task._id}`}
                            underline="hover"
                            color="inherit"
                          >
                            {task.title}
                          </Link>
                          <IconButton
                            edge="end"
                            onClick={() =>
                              navigate(`/projects/${id}/tasks/${task._id}/edit`)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))
                    )}
                  </Box>
                </Grid2>
              </Grid2>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default React.memo(ProjectDetail);
