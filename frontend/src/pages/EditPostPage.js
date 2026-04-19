import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const EditPostPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`);
                if (data.author?._id !== user?._id && user?.role !== 'admin') {
                    navigate('/home');
                    return;
                }
                setTitle(data.title);
                setBody(data.body);
            } catch (err) {
                setError('Post not found');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadPost();
        }
    }, [id, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        const fd = new FormData();
        fd.append('title', title);
        fd.append('body', body);
        if (image) fd.append('image', image);
        try {
            await API.put(`/posts/${id}`, fd);
            navigate(`/posts/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container"><div style={{ textAlign: 'center', padding: '60px' }}>Loading post...</div></div>;

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Edit Post</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Post Title</label>
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Enter post title" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Post Content</label>
                        <textarea 
                            value={body} 
                            onChange={e => setBody(e.target.value)} 
                            placeholder="Edit your post content..." 
                            rows={12} 
                            required 
                        />
                    </div>
                    {user?.role === 'admin' && (
                        <div className="form-group">
                            <label>Update Cover Image (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => setImage(e.target.files[0])} 
                            />
                            {image && <small style={{ color: 'var(--gray-600)' }}>Selected: {image.name}</small>}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Updating...' : 'Update Post'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => navigate(`/posts/${id}`)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostPage;