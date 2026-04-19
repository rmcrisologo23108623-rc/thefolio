import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const PostPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentBody, setCommentBody] = useState('');
    const [replyBody, setReplyBody] = useState({});
    const [showReplyForm, setShowReplyForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPost = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`);
                setPost(data);
            } catch (err) {
                setError('Post not found');
            } finally {
                setLoading(false);
            }
        };

        const loadComments = async () => {
            try {
                const { data } = await API.get(`/comments/${id}`);
                setComments(data);
            } catch (err) {
                console.error('Error fetching comments:', err);
            }
        };

        loadPost();
        loadComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const { data } = await API.post(`/comments/${id}`, { body: commentBody });
            setComments(prevComments => [data, ...prevComments]);
            setCommentBody('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post comment');
        }
    };

    const handleReplySubmit = async (commentId) => {
        if (!replyBody[commentId]?.trim()) return;
        
        try {
            const { data } = await API.post(`/comments/${commentId}/reply`, { body: replyBody[commentId] });
            setComments(comments.map(c => c._id === commentId ? data : c));
            setReplyBody({ ...replyBody, [commentId]: '' });
            setShowReplyForm({ ...showReplyForm, [commentId]: false });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post reply');
        }
    };

    const deleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await API.delete(`/comments/${commentId}`);
                setComments(comments.filter(c => c._id !== commentId));
            } catch (err) {
                setError('Failed to delete comment');
            }
        }
    };

    const deleteReply = async (commentId, replyId) => {
        if (window.confirm('Are you sure you want to delete this reply?')) {
            try {
                await API.delete(`/comments/${commentId}/reply/${replyId}`);
                const { data } = await API.get(`/comments/${id}`);
                setComments(data);
            } catch (err) {
                setError('Failed to delete reply');
            }
        }
    };

    const deletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await API.delete(`/posts/${id}`);
                navigate('/home');
            } catch (err) {
                setError('Failed to delete post');
            }
        }
    };

    const canReplyToComment = (commentAuthorId) => {
        if (!user) return false;
        // Admin can reply to any comment
        if (user.role === 'admin') return true;
        // Post author can reply to any comment on their post
        if (post && post.author?._id === user._id) return true;
        return false;
    };

    const canDeleteComment = (commentAuthorId) => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        if (commentAuthorId === user._id) return true;
        return false;
    };

    const canDeleteReply = (replyAuthorId) => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        if (replyAuthorId === user._id) return true;
        return false;
    };

    if (loading) return <div className="container"><div style={{ textAlign: 'center', padding: '60px' }}>Loading post...</div></div>;
    if (error) return <div className="container"><div className="error-msg">{error}</div></div>;
    if (!post) return <div className="container"><div className="error-msg">Post not found</div></div>;

    const canEdit = user && (user._id === post.author?._id || user.role === 'admin');

    return (
        
        <div className="container">
            {post.image && (
                <img 
                    src={`http://localhost:5000/uploads/${post.image}`} 
                    alt={post.title} 
                    style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-xl)' }}
                />
            )}
            <h1>{post.title}</h1>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)', 
                paddingBottom: 'var(--spacing-md)', 
                borderBottom: '2px solid var(--gray-300)',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)'
            }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', color: 'var(--gray-600)' }}>
                    <span>By {post.author?.name || 'Unknown'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {canEdit && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <Link to={`/edit-post/${id}`}>
                            <button className="btn-primary" style={{ padding: '8px 20px' }}>Edit</button>
                        </Link>
                        <button onClick={deletePost} className="btn-danger" style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>
                )}
            </div>
            
            <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
                <h3>Comments ({comments.length})</h3>
                
                {/* Add Comment Form */}
                {user ? (
                    <form onSubmit={handleCommentSubmit} style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <div className="form-group">
                            <textarea
                                value={commentBody}
                                onChange={e => setCommentBody(e.target.value)}
                                placeholder="Write a comment..."
                                required
                                rows={3}
                                style={{ width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Post Comment</button>
                    </form>
                ) : (
                    <p style={{ marginBottom: 'var(--spacing-xl)' }}><Link to="/login">Login</Link> to leave a comment</p>
                )}

                {/* Comments List */}
                <div>
                    {comments.map(comment => (
                        <div key={comment._id} className="comment-card" style={{ 
                            marginBottom: 'var(--spacing-lg)',
                            backgroundColor: 'var(--gray-50)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-lg)'
                        }}>
                            <div className="comment-header" style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: 'var(--spacing-sm)',
                                flexWrap: 'wrap',
                                gap: 'var(--spacing-sm)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                    <span className="comment-author" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {comment.author?.name}
                                    </span>
                                    {comment.author?.role === 'admin' && (
                                        <span style={{ 
                                            backgroundColor: 'var(--accent)', 
                                            color: 'var(--primary)', 
                                            padding: '2px 8px', 
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold'
                                        }}>
                                            Admin
                                        </span>
                                    )}
                                    {post.author?._id === comment.author?._id && (
                                        <span style={{ 
                                            backgroundColor: 'var(--primary)', 
                                            color: 'white', 
                                            padding: '2px 8px', 
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold'
                                        }}>
                                            Author
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <span className="comment-date" style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                    {canDeleteComment(comment.author?._id) && (
                                        <button 
                                            onClick={() => deleteComment(comment._id)} 
                                            className="delete-comment"
                                            style={{ 
                                                background: '#dc3545', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '4px 12px', 
                                                borderRadius: 'var(--radius-full)',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="comment-body" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <p style={{ lineHeight: '1.6' }}>{comment.body}</p>
                            </div>
                            
                            {/* Replies Section */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div style={{ 
                                    marginLeft: 'var(--spacing-xl)', 
                                    marginTop: 'var(--spacing-md)',
                                    paddingLeft: 'var(--spacing-lg)',
                                    borderLeft: `3px solid var(--accent)`
                                }}>
                                    {comment.replies.map(reply => (
                                        <div key={reply._id} style={{ 
                                            marginBottom: 'var(--spacing-md)',
                                            padding: 'var(--spacing-sm)',
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            borderRadius: 'var(--radius-md)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xs)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                                                        {reply.author?.name}
                                                    </span>
                                                    {reply.author?.role === 'admin' && (
                                                        <span style={{ 
                                                            backgroundColor: 'var(--accent)', 
                                                            color: 'var(--primary)', 
                                                            padding: '2px 6px', 
                                                            borderRadius: 'var(--radius-full)',
                                                            fontSize: '0.65rem'
                                                        }}>
                                                            Admin
                                                        </span>
                                                    )}
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                                                        replied {new Date(reply.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {canDeleteReply(reply.author?._id) && (
                                                    <button 
                                                        onClick={() => deleteReply(comment._id, reply._id)}
                                                        style={{ 
                                                            background: 'transparent', 
                                                            color: '#dc3545', 
                                                            border: 'none', 
                                                            cursor: 'pointer',
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{reply.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Reply Button and Form */}
                            {canReplyToComment(comment.author?._id) && (
                                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                    {!showReplyForm[comment._id] ? (
                                        <button 
                                            onClick={() => setShowReplyForm({ ...showReplyForm, [comment._id]: true })}
                                            style={{ 
                                                background: 'transparent', 
                                                color: 'var(--accent)', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                padding: '4px 0'
                                            }}
                                        >
                                            ↪ Reply
                                        </button>
                                    ) : (
                                        <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                            <textarea
                                                value={replyBody[comment._id] || ''}
                                                onChange={(e) => setReplyBody({ ...replyBody, [comment._id]: e.target.value })}
                                                placeholder="Write your reply..."
                                                rows={2}
                                                style={{ 
                                                    width: '100%', 
                                                    padding: 'var(--spacing-sm)', 
                                                    borderRadius: 'var(--radius-md)', 
                                                    border: '1px solid var(--gray-300)',
                                                    marginBottom: 'var(--spacing-sm)'
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                                <button 
                                                    onClick={() => handleReplySubmit(comment._id)}
                                                    className="btn-primary"
                                                    style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                                                >
                                                    Submit Reply
                                                </button>
                                                <button 
                                                    onClick={() => setShowReplyForm({ ...showReplyForm, [comment._id]: false })}
                                                    style={{ 
                                                        padding: '6px 16px', 
                                                        fontSize: '0.8rem',
                                                        background: 'var(--gray-300)',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius-full)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {comments.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
                            No comments yet. Be the first to comment!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostPage;