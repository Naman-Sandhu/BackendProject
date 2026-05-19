import { useState } from 'react';
import { api } from '../api';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (profilePic) data.append('profilePic', profilePic);

      const res = await api.post('/api/auth/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage(res.data.message);
      setFormData({ name: '', email: '', password: '' });
      setProfilePic(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="form-page">
      <div className="page">
        <h1>Create Account</h1>
        <p>Register to book your movie tickets securely.</p>

        <form onSubmit={handleSubmit} className="form-card">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Create Account</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Signup;