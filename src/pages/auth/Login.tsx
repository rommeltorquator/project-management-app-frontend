import React, { useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

const Login = () => {
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await axiosInstance.post(`/auth/login`, formData);
        const { token } = response.data;
        setAuthData({ token });
        navigate('/');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Login failed');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, setAuthData]
  );

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default React.memo(Login);
