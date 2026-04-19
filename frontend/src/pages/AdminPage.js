import { useState, useEffect } from 'react';
import API from '../api/axios';
import AdminMessages from '../components/AdminMessages';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('users');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, postsRes] = await Promise.all([
                API.get('/admin/users'),
                API.get('/admin/posts')
            ]);
            setUsers(usersRes.data);
            setPosts(postsRes.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const { data } = await API.put(`/admin/users/${id}/status`);
            setUsers(users.map(u => u._id === id ? data.user : u));
        } catch (err) {
            console.error('Error toggling status:', err);
        }
    };

    const removePost = async (id) => {
        if (window.confirm('Are you sure you want to remove this post?')) {
            try {
                await API.put(`/admin/posts/${id}/remove`);
                setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
            } catch (err) {
                console.error('Error removing post:', err);
            }
        }
    };

    if (loading) {
        return <div className="container"><div style={{ textAlign: 'center', padding: '60px' }}>Loading dashboard...</div></div>;
    }

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '1200px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Admin Dashboard</h2>
                
                <div className="admin-tabs">
                    <button 
                        onClick={() => setTab('users')} 
                        className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
                    >
                        👥 Members ({users.length})
                    </button>
                    <button 
                        onClick={() => setTab('posts')} 
                        className={`admin-tab ${tab === 'posts' ? 'active' : ''}`}
                    >
                        📝 All Posts ({posts.length})
                    </button>
                    <button 
                        onClick={() => setTab('messages')} 
                        className={`admin-tab ${tab === 'messages' ? 'active' : ''}`}
                    >
                        💬 Messages
                    </button>
                </div>

                {tab === 'users' && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td><strong>{u.name}</strong></td>
                                        <td>{u.email}</td>
                                        <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                onClick={() => toggleStatus(u._id)} 
                                                className={`btn-icon ${u.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                                            >
                                                {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>No members found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'posts' && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(p => (
                                    <tr key={p._id}>
                                        <td><strong>{p.title}</strong></td>
                                        <td>{p.author?.name || 'Unknown'}</td>
                                        <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                                        <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {p.status === 'published' && (
                                                <button className="btn-icon btn-danger" onClick={() => removePost(p._id)}>
                                                    Remove
                                                </button>
                                            )}
                                            {p.status === 'removed' && (
                                                <span style={{ color: 'var(--gray-500)' }}>Removed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>No posts found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'messages' && <AdminMessages />}
            </div>
        </div>
    );
};

export default AdminPage;