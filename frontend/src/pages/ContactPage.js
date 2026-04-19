import React, { useState } from 'react';
import API from '../api/axios';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({ name: '', email: '', message: '' });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [submitting, setSubmitting] = useState(false);

    const validateField = (name, value) => {
        if (name === 'name') {
            if (!value) return 'Name is required.';
            if (value.length < 2) return 'Name must be at least 2 characters.';
            if (!/^[a-zA-Z\s\-']+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
            return '';
        }
        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return 'Email is required.';
            if (!emailPattern.test(value)) return 'Enter a valid email address.';
            return '';
        }
        if (name === 'message') {
            if (!value) return 'Message cannot be empty.';
            if (value.length < 5) return 'Message must be at least 5 characters.';
            if (value.length > 1000) return 'Message is too long (max 1000 characters).';
            return '';
        }
        return '';
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id === 'contactName' ? 'name' : id === 'contactEmail' ? 'email' : 'message';
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        const error = validateField(fieldName, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const newErrors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            message: validateField('message', formData.message)
        };
        setErrors(newErrors);
        
        const hasErrors = Object.values(newErrors).some(e => e);
        
        if (!hasErrors) {
            try {
                // Send message to backend
                const response = await API.post('/messages', formData);
                
                if (response.data.success) {
                    setToastType('success');
                    setToastMessage('✅ Message sent successfully! An admin will respond shortly.');
                    setShowToast(true);
                    setFormData({ name: '', email: '', message: '' });
                    
                    // Hide toast after 5 seconds
                    setTimeout(() => setShowToast(false), 5000);
                }
            } catch (err) {
                setToastType('error');
                setToastMessage('❌ Failed to send message. Please try again.');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            }
        }
        setSubmitting(false);
    };

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '900px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>Connect & Learn</h2>
                <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', color: 'var(--gray-600)' }}>
                    Have a question or want to collaborate? Send us a message — we'd love to hear from you!
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            id="contactName" 
                            placeholder="e.g., Maria Santos" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                        {errors.name && <div className="error-msg" style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{errors.name}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            id="contactEmail" 
                            placeholder="example@email.com" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                        {errors.email && <div className="error-msg" style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{errors.email}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label>Message</label>
                        <textarea 
                            id="contactMessage" 
                            rows="5" 
                            placeholder="Your volleyball questions, feedback, or ideas..." 
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                        {errors.message && <div className="error-msg" style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{errors.message}</div>}
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                        {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Recommended Resources</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>Resource Name</th><th>Description</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><a href="https://www.fivb.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: '600' }}>FIVB Official</a></td>
                                    <td>The international governing body for all forms of volleyball.</td>
                                </tr>
                                <tr>
                                    <td><a href="https://www.theartofcoaching.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: '600' }}>The Art of Coaching</a></td>
                                    <td>In-depth drills and technical breakdowns for all positions.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Our Training Location</h3>
                    <div style={{ 
                        background: 'var(--gray-100)', 
                        borderRadius: 'var(--radius-lg)', 
                        padding: 'var(--spacing-xl)', 
                        textAlign: 'center',
                        border: '2px dashed var(--accent)'
                    }}>
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <span style={{ fontSize: '50px' }}>🏐📍</span>
                        </div>
                        <p style={{ marginTop: 'var(--spacing-md)', fontWeight: '600', fontSize: '1.1rem' }}>Sports Complex - Main Court</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>123 Volleyball Avenue, Sports City</p>
                        <p style={{ marginTop: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                            <span style={{ fontWeight: '600' }}>Directions:</span> Take the MRT to Sports Station, then walk 5 minutes east.
                        </p>
                    </div>
                </div>
            </div>
            
            {showToast && (
                <div className="toast-notification" style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: toastType === 'success' ? '#28a745' : '#dc3545',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1100,
                    animation: 'slideUp 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default ContactPage;