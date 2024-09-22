import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

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

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (projects.length === 0) {
    return <div>
      <button onClick={handleCreateProject}>Create New Project</button>
      <p>No projects found.</p>
    </div>
  }

  return (
    <div>
      <h2>Your Projectsss</h2>
      <button onClick={handleCreateProject}>Create New Project</button>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <h3><Link to={`/projects/${project._id}`}>{project.title}</Link></h3>
            {project.description && <p>{project.description}</p>}
            {/* Display other project details as needed */}
            <button onClick={() => navigate(`/projects/${project._id}/edit`)}>Edit</button>
            <button onClick={() => handleDeleteProject(project._id)} style={{ color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
