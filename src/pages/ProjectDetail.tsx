import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import {Container, Box, Typography, Button, CircularProgress, Alert} from "@mui/material"

interface Project {
  _id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${id}`);
        setProject(response.data);
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
      </Box>
    </Container>
  );
};

export default React.memo(ProjectDetail);
