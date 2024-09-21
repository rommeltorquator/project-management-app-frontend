import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';

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

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:5100/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`, // Assuming a Bearer token
          },
        });
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

  useEffect(() => {
    const fetchProjects = async () => {
      console.log("Projects useEffect");
      setLoading(true); // Ensure you set loading state before making the request
      try {
        // Retrieve the token from the cookie
        const token = Cookies.get('token');
    
        if (!token) {
          setError('Authentication token not found. Please log in.');
          return;
        }
    
        // Make the GET request with the Authorization header
        const response = await axios.get('http://localhost:5100/api/projects/', {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming a Bearer token
          },
        });
    
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

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (projects.length === 0) {
    return <p>No projects found.</p>;
  }

  return (
    <div>
      <p>awawawawaw</p>
      <h2>Your Projects</h2>
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
