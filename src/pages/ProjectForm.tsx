import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

interface ProjectFormData {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;
}

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'Medium',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      // Fetch existing project data
      const fetchProject = async () => {
        try {
          const token = Cookies.get('token');
    
          if (!token) {
            setError('Authentication token not found. Please log in.');
            return;
          }

          const response = await axios.get(`http://localhost:5100/api/projects/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Assuming a Bearer token
            },
          });

          setFormData(response.data);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'Failed to fetch project data');
          } else {
            setError('Failed to fetch project data');
          }
        }
      };

      fetchProject();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        // Update existing project
        await axios.put(`http://localhost:5100/api/projects/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`, // Assuming a Bearer token
          },
        });
      } else {
        // Create new project
        await axios.post('http://localhost:5100/api/projects/', formData, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`, // Assuming a Bearer token
          },
        });
      }
      navigate('/projects');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to save project');
      } else {
        setError('Failed to save project');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isEditMode ? 'Edit Project' : 'Create Project'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title:
              <input name="title" value={formData.title} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Start Date:
              <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              End Date:
              <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Priority:
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {isEditMode ? 'Update Project' : 'Create Project'}
          </button>
        </form>
      )}
    </div>
  );
};

export default React.memo(ProjectForm);
