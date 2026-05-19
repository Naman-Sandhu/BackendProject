import { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '../api';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', decodeURIComponent(user));
      window.dispatchEvent(new Event('userUpdated'));
      navigate('/movies');
    }
    if (searchParams.get('error')) {
      setMessage('Google login failed. Try again.');
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('userUpdated'));
      setMessage('Login successful');
      setTimeout(() => navigate('/movies'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="form-page">
      <div className="page">
        <h1>Login</h1>
        <p>Login to continue booking your favorite movies.</p>

        <form className="form-card" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div style={{ textAlign: 'center', margin: '12px 0' }}>or</div>

        <button
          onClick={() => window.location.href = `${API_BASE_URL}/api/auth/google`}
          style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
        >
          Login with Google
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
