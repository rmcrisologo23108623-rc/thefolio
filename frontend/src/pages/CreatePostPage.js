import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const fd = new FormData();
        fd.append('title', title);
        fd.append('body', body);
        if (image) fd.append('image', image);
        try {
            const { data } = await API.post('/posts', fd);
            navigate(`/posts/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to publish post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Write a New Post</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Post Title</label>
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Enter an engaging title..." 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Post Content</label>
                        <textarea 
                            value={body} 
                            onChange={e => setBody(e.target.value)} 
                            placeholder="Write your story here..." 
                            rows={12} 
                            required 
                        />
                    </div>
                    {user?.role === 'admin' && (
                        <div className="form-group">
                            <label>Upload Cover Image (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => setImage(e.target.files[0])} 
                            />
                            {image && <small style={{ color: 'var(--gray-600)' }}>Selected: {image.name}</small>}
                            <small style={{ display: 'block', marginTop: 'var(--spacing-xs)', color: 'var(--gray-500)' }}>
                                Recommended size: 1200x800px. Max 5MB.
                            </small>
                        </div>
                    )}
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;