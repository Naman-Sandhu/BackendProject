import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getMediaUrl } from '../api';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          profilePic: res.data.profilePic
        }));
        window.dispatchEvent(new Event('userUpdated'));
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="form-page profile-page">
      <div className="page">
        <div className="profile-header">
          {user.profilePic
            ? <img
                src={getMediaUrl(user.profilePic)}
                alt={user.name}
                className="profile-avatar"
                referrerPolicy="no-referrer"
              />
            : <div className="profile-avatar profile-avatar-initials">{user.name?.charAt(0).toUpperCase()}</div>
          }
          <h2>{user.name}</h2>
          <span className="profile-email">{user.email}</span>
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <label>Full Name</label>
            <p>{user.name}</p>
          </div>
          <div className="profile-field">
            <label>Email Address</label>
            <p>{user.email}</p>
          </div>
          <div className="profile-field">
            <label>Account Type</label>
            <p>{user.googleId ? 'Google Account' : 'Email & Password'}</p>
          </div>
          <div className="profile-field">
            <label>Member Since</label>
            <p>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <button className="profile-logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
