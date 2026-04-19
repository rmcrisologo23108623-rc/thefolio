import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [pic, setPic] = useState(null);
    const [curPw, setCurPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleProfile = async (e) => {
        e.preventDefault();
        setMsg('');
        setError('');
        setLoading(true);
        const fd = new FormData();
        fd.append('name', name);
        fd.append('bio', bio);
        if (pic) fd.append('profilePic', pic);
        try {
            const { data } = await API.put('/auth/profile', fd);
            setUser(data);
            setMsg('Profile updated successfully!');
            setPic(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePassword = async (e) => {
        e.preventDefault();
        setMsg('');
        setError('');
        setLoading(true);
        try {
            await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
            setMsg('Password changed successfully!');
            setCurPw('');
            setNewPw('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error changing password');
        } finally {
            setLoading(false);
        }
    };

    const picSrc = user?.profilePic 
        ? `http://localhost:5000/uploads/${user.profilePic}` 
        : 'https://via.placeholder.com/150x150?text=👤';

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '700px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>My Profile</h2>
                
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <img 
                        src={picSrc} 
                        alt="Profile" 
                        style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '50%', 
                            objectFit: 'cover',
                            border: '3px solid var(--accent)',
                            marginBottom: 'var(--spacing-md)'
                        }} 
                    />
                </div>
                
                {msg && <div className="success-msg">{msg}</div>}
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleProfile}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.25rem' }}>Edit Profile</h3>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Your display name" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea 
                            value={bio} 
                            onChange={e => setBio(e.target.value)} 
                            placeholder="Tell us about yourself..." 
                            rows={3} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Profile Picture</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => setPic(e.target.files[0])} 
                        />
                        {pic && <small style={{ color: 'var(--gray-600)' }}>Selected: {pic.name}</small>}
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>

                <form onSubmit={handlePassword} style={{ marginTop: 'var(--spacing-2xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.25rem' }}>Change Password</h3>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter current password" 
                            value={curPw} 
                            onChange={e => setCurPw(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter new password (min 6 characters)" 
                            value={newPw} 
                            onChange={e => setNewPw(e.target.value)} 
                            required 
                            minLength={6} 
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;