import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/messages');
            setMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/messages/${id}/status`, { status });
            fetchMessages();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const sendReply = async (id) => {
        if (!replyText.trim()) {
            alert('Please enter a reply message');
            return;
        }
        try {
            await API.put(`/messages/${id}/reply`, { reply: replyText });
            setShowReplyModal(false);
            setReplyText('');
            fetchMessages();
        } catch (err) {
            console.error('Error sending reply:', err);
            alert('Failed to send reply');
        }
    };

    const deleteMessage = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await API.delete(`/messages/${id}`);
                fetchMessages();
            } catch (err) {
                console.error('Error deleting message:', err);
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            unread: { class: 'status-badge unread', text: '📩 Unread' },
            read: { class: 'status-badge read', text: '👁️ Read' },
            replied: { class: 'status-badge replied', text: '✅ Replied' },
            archived: { class: 'status-badge archived', text: '📦 Archived' }
        };
        const config = statusConfig[status] || statusConfig.unread;
        return <span className={config.class}>{config.text}</span>;
    };

    const getFilteredMessages = () => {
        if (filter === 'all') return messages;
        return messages.filter(m => m.status === filter);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Loading messages...</div>;
    }

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)'
            }}>
                <h3>Contact Messages</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button 
                        onClick={() => setFilter('all')}
                        className={`admin-tab ${filter === 'all' ? 'active' : ''}`}
                    >
                        All ({messages.length})
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`admin-tab ${filter === 'unread' ? 'active' : ''}`}
                    >
                        Unread ({messages.filter(m => m.status === 'unread').length})
                    </button>
                    <button 
                        onClick={() => setFilter('replied')}
                        className={`admin-tab ${filter === 'replied' ? 'active' : ''}`}
                    >
                        Replied ({messages.filter(m => m.status === 'replied').length})
                    </button>
                </div>
            </div>

            {getFilteredMessages().length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
                    No messages found
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>From</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Received</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredMessages().map(msg => (
                                <tr key={msg._id} style={{ 
                                    backgroundColor: msg.status === 'unread' ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                                }}>
                                    <td>{getStatusBadge(msg.status)}</td>
                                    <td><strong>{msg.name}</strong></td>
                                    <td>{msg.email}</td>
                                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {msg.message.substring(0, 60)}...
                                    </td>
                                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <button 
                                                className="btn-icon btn-primary"
                                                onClick={() => {
                                                    setSelectedMessage(msg);
                                                    setShowReplyModal(true);
                                                    if (msg.status === 'unread') {
                                                        updateStatus(msg._id, 'read');
                                                    }
                                                }}
                                                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                                            >
                                                View & Reply
                                            </button>
                                            <button 
                                                className="btn-icon btn-danger"
                                                onClick={() => deleteMessage(msg._id)}
                                                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && selectedMessage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }} onClick={() => setShowReplyModal(false)}>
                    <div style={{
                        backgroundColor: 'var(--white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-xl)',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowReplyModal(false)}
                            style={{
                                position: 'absolute',
                                top: 'var(--spacing-md)',
                                right: 'var(--spacing-md)',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                        
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Message from {selectedMessage.name}</h3>
                        
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <strong>Email:</strong> {selectedMessage.email}
                        </div>
                        
                        <div style={{ 
                            background: 'var(--gray-100)', 
                            padding: 'var(--spacing-md)', 
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            <strong>Message:</strong>
                            <p style={{ marginTop: 'var(--spacing-sm)', lineHeight: '1.6' }}>{selectedMessage.message}</p>
                        </div>
                        
                        {selectedMessage.reply && (
                            <div style={{ 
                                background: 'rgba(40, 167, 69, 0.1)', 
                                padding: 'var(--spacing-md)', 
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-lg)',
                                borderLeft: '3px solid #28a745'
                            }}>
                                <strong>Previous Reply:</strong>
                                <p style={{ marginTop: 'var(--spacing-sm)', lineHeight: '1.6' }}>{selectedMessage.reply}</p>
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label>Your Reply</label>
                            <textarea
                                rows="5"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                                style={{ width: '100%', padding: 'var(--spacing-md)' }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                            <button className="btn-secondary" onClick={() => setShowReplyModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={() => sendReply(selectedMessage._id)}>
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMessages;