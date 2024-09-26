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
    return <p>Loading project details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div>
      <h2>{project.title}</h2>
      {project.description && <p>{project.description}</p>}
      {project.startDate && <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>}
      {project.endDate && <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>}
      {project.priority && <p>Priority: {project.priority}</p>}
      <button onClick={handleEditProject}>Edit Project</button>
      <button onClick={handleDeleteProject} style={{ color: 'red' }}>Delete Project</button>
    </div>
  );
};

export default React.memo(ProjectDetail);
