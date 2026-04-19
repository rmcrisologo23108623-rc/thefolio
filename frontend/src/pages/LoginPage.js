import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            
            // Show success notification
            setSuccessMessage(`Welcome back ${user.name}! Redirecting to HomePage...`);
            setShowSuccessToast(true);
            
            // Redirect based on role after 1.5 seconds
            setTimeout(() => {
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            }, 1500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetMessage('');
        setResetError('');
        setResetLoading(true);
        
        try {
            // This would connect to your backend API
            setTimeout(() => {
                if (resetEmail) {
                    setResetMessage(`Password reset link sent to ${resetEmail}. Please check your email.`);
                    setResetEmail('');
                    setTimeout(() => {
                        setShowForgotPassword(false);
                        setResetMessage('');
                    }, 3000);
                } else {
                    setResetError('Please enter your email address.');
                }
                setResetLoading(false);
            }, 1500);
        } catch (err) {
            setResetError(err.response?.data?.message || 'Something went wrong. Please try again.');
            setResetLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Welcome Back</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                                style={{ flex: 1, paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    fontSize: '1.1rem',
                                    color: 'var(--gray-600)'
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--gray-600)'}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'right', marginBottom: 'var(--spacing-lg)' }}>
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--accent)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                padding: '0',
                                textDecoration: 'underline'
                            }}
                        >
                            Forgot Password?
                        </button>
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--gray-600)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>Register here</Link>
                </p>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
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
                }} onClick={() => setShowForgotPassword(false)}>
                    <div style={{
                        backgroundColor: 'var(--white)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-xl)',
                        maxWidth: '450px',
                        width: '90%',
                        position: 'relative',
                        boxShadow: 'var(--shadow-xl)'
                    }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowForgotPassword(false)}
                            style={{
                                position: 'absolute',
                                top: 'var(--spacing-md)',
                                right: 'var(--spacing-md)',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: 'var(--gray-600)'
                            }}
                        >
                            ×
                        </button>
                        
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Reset Password</h3>
                        <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--gray-600)' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        
                        {resetMessage && <div className="success-msg">{resetMessage}</div>}
                        {resetError && <div className="error-msg">{resetError}</div>}
                        
                        <form onSubmit={handleForgotPassword}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={resetEmail} 
                                    onChange={e => setResetEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn-primary" 
                                style={{ width: '100%' }} 
                                disabled={resetLoading}
                            >
                                {resetLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                        
                        <p style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            Remember your password?{' '}
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--accent)',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* Success Toast Notification */}
            {showSuccessToast && (
                <div className="toast-notification success-toast" style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1100,
                    animation: 'slideUp 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: 'none'
                }}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default LoginPage;