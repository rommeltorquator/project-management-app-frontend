import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

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
          const response = await axiosInstance.get(`/projects/${id}`);
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
        await axiosInstance.put(`/projects/${id}`);
      } else {
        // Create new project
        await axiosInstance.post(`/projects/`, formData);
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
