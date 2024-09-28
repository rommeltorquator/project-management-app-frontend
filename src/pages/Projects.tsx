import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

import {Container, Box, Typography, Button, CircularProgress, Alert, Grid2, Card, CardContent, CardActions, Link} from "@mui/material"

interface Project {
  _id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {      
      setLoading(true); // Ensure you set loading state before making the request
      try {  
        const response = await axiosInstance.get('/projects/'); // Relative path
        setProjects(response.data); // Update your state with the fetched projects
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch projects');
        } else {
          setError('Failed to fetch projects');
        }
      } finally {
        setLoading(false); // Ensure you unset loading state after the request
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axiosInstance.delete(`/projects/${projectId}`);
        setProjects((prevProjects) => prevProjects.filter((p) => p._id !== projectId));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to delete project');
        } else {
          setError('Failed to delete project');
        }
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateProject}
          sx={{ mb: 2 }}
        >
          Create New Project
        </Button>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : projects.length === 0 ? (
          <Typography variant="body1">No projects found.</Typography>
        ) : (
          <Grid2 container spacing={2}>
            {projects.map((project) => (
              // <Grid2 item xs={12} sm={6} md={4} key={project._id}>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={project._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      <Link
                        component={RouterLink}
                        to={`/projects/${project._id}`}
                        underline="hover"
                        color="inherit"
                      >
                        {project.title}
                      </Link>
                    </Typography>
                    {project.description && (
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    )}
                    {project.priority && (
                      <Typography variant="body2">
                        Priority: {project.priority}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/projects/${project._id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}
      </Box>
    </Container>
  );
};

export default Projects;
