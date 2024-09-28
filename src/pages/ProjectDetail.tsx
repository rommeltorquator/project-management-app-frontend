import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import {Container, Box, Typography, Button, CircularProgress, Alert, List, ListItem, ListItemText, IconButton } from "@mui/material"

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
    <Container maxWidth="sm">
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
        </Box>
        {/* Display Tasks */}
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
              <List>
                {project.tasks.map((task) => (
                  <ListItem key={task._id} disableGutters>
                    <ListItemText
                      primary={task.title}
                      secondary={`Status: ${task.status}`}
                    />
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
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default React.memo(ProjectDetail);
