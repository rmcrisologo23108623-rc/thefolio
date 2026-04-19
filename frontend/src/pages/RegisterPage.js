import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const RegisterPage = () => {
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [errors, setErrors] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        hasLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecial: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Validate Name
    const validateName = (name) => {
        if (!name) return 'Name is required.';
        if (name.length < 2) return 'Name must be at least 2 characters.';
        if (!/^[a-zA-Z\s\-']+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
        return '';
    };

    // Validate Email (must contain @ and .com)
    const validateEmail = (email) => {
        if (!email) return 'Email is required.';
        if (!email.includes('@')) return 'Email must contain "@" symbol.';
        if (!email.includes('.com')) return 'Email must contain ".com" domain.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;
        if (!emailPattern.test(email)) return 'Enter a valid email address (e.g., name@domain.com).';
        return '';
    };

    // Check Password Strength
    const checkPasswordStrength = (password) => {
        const hasLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        let score = 0;
        let message = '';
        
        if (hasLength) score++;
        if (hasUpperCase) score++;
        if (hasLowerCase) score++;
        if (hasNumber) score++;
        if (hasSpecial) score++;
        
        if (score === 5) message = 'Strong ✓';
        else if (score >= 3) message = 'Medium';
        else if (score > 0) message = 'Weak';
        else message = 'Very Weak';
        
        setPasswordStrength({
            score,
            message,
            hasLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecial
        });
        
        if (!password) return 'Password is required.';
        if (password.length < 8) return 'Password must be at least 8 characters.';
        if (!hasUpperCase) return 'Password must contain at least one uppercase letter.';
        if (!hasLowerCase) return 'Password must contain at least one lowercase letter.';
        if (!hasNumber) return 'Password must contain at least one number.';
        if (!hasSpecial) return 'Password must contain at least one special character (!@#$%^&*).';
        return '';
    };

    // Validate Confirm Password
    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Please confirm your password.';
        if (confirmPassword !== password) return 'Passwords do not match.';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Real-time validation
        if (name === 'name') {
            setErrors(prev => ({ ...prev, name: validateName(value) }));
        }
        if (name === 'email') {
            setErrors(prev => ({ ...prev, email: validateEmail(value) }));
        }
        if (name === 'password') {
            const passwordError = checkPasswordStrength(value);
            setErrors(prev => ({ ...prev, password: passwordError }));
            if (form.confirmPassword) {
                setErrors(prev => ({ 
                    ...prev, 
                    confirmPassword: validateConfirmPassword(form.confirmPassword, value) 
                }));
            }
        }
        if (name === 'confirmPassword') {
            setErrors(prev => ({ 
                ...prev, 
                confirmPassword: validateConfirmPassword(value, form.password) 
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Final validation
        const nameError = validateName(form.name);
        const emailError = validateEmail(form.email);
        const passwordError = checkPasswordStrength(form.password);
        const confirmPasswordError = validateConfirmPassword(form.confirmPassword, form.password);
        
        const newErrors = {
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        };
        setErrors(newErrors);
        
        const hasErrors = Object.values(newErrors).some(e => e);
        
        if (!hasErrors) {
            try {
                const { data } = await API.post('/auth/register', {
                    name: form.name,
                    email: form.email,
                    password: form.password
                });
                
                // Show success notification
                setSuccessMessage(`Welcome ${form.name}! Your account has been created successfully. Redirecting to login...`);
                setShowSuccessToast(true);
                
                // Store token
                localStorage.setItem('token', data.token);
                
                // Clear form
                setForm({ name: '', email: '', password: '', confirmPassword: '' });
                
                // Hide toast after 3 seconds and redirect
                setTimeout(() => {
                    setShowSuccessToast(false);
                    navigate('/home');
                }, 3000);
                
            } catch (err) {
                setErrors(prev => ({ 
                    ...prev, 
                    email: err.response?.data?.message || 'Registration failed.' 
                }));
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Get color for password strength bar
    const getStrengthColor = () => {
        const { score } = passwordStrength;
        if (score === 5) return '#28a745';
        if (score >= 3) return '#ffc107';
        if (score > 0) return '#fd7e14';
        return '#dc3545';
    };

    // Get width for password strength bar
    const getStrengthWidth = () => {
        const { score } = passwordStrength;
        return `${(score / 5) * 100}%`;
    };

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '550px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Create Account</h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input 
                            name="name" 
                            type="text"
                            placeholder="Enter your full name" 
                            value={form.name} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.name && <div className="error-msg" style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{errors.name}</div>}
                    </div>
                    
                    {/* Email Field */}
                    <div className="form-group">
                        <label>Email Address *</label>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="name@domain.com" 
                            value={form.email} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.email && <div className="error-msg" style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{errors.email}</div>}
                        <small style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
                            Must contain "@" and ".com"
                        </small>
                    </div>
                    
                    {/* Password Field with Toggle */}
                    <div className="form-group">
                        <label>Password *</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Create a strong password" 
                                value={form.password} 
                                onChange={handleChange} 
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
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {form.password && (
                            <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                <div style={{
                                    height: '4px',
                                    backgroundColor: 'var(--gray-300)',
                                    borderRadius: '2px',
                                    overflow: 'hidden',
                                    marginBottom: 'var(--spacing-xs)'
                                }}>
                                    <div style={{
                                        width: getStrengthWidth(),
                                        height: '100%',
                                        backgroundColor: getStrengthColor(),
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.75rem',
                                    marginBottom: 'var(--spacing-xs)'
                                }}>
                                    <span>Password Strength:</span>
                                    <span style={{ color: getStrengthColor(), fontWeight: '600' }}>
                                        {passwordStrength.message}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                                        <span style={{ color: passwordStrength.hasLength ? '#28a745' : '#dc3545' }}>
                                            {passwordStrength.hasLength ? '✓' : '○'} 8+ chars
                                        </span>
                                        <span style={{ color: passwordStrength.hasUpperCase ? '#28a745' : '#dc3545' }}>
                                            {passwordStrength.hasUpperCase ? '✓' : '○'} Uppercase
                                        </span>
                                        <span style={{ color: passwordStrength.hasLowerCase ? '#28a745' : '#dc3545' }}>
                                            {passwordStrength.hasLowerCase ? '✓' : '○'} Lowercase
                                        </span>
                                        <span style={{ color: passwordStrength.hasNumber ? '#28a745' : '#dc3545' }}>
                                            {passwordStrength.hasNumber ? '✓' : '○'} Number
                                        </span>
                                        <span style={{ color: passwordStrength.hasSpecial ? '#28a745' : '#dc3545' }}>
                                            {passwordStrength.hasSpecial ? '✓' : '○'} Special (!@#$%^&*)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {errors.password && <div className="error-msg" style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{errors.password}</div>}
                    </div>
                    
                    {/* Confirm Password Field with Toggle */}
                    <div className="form-group">
                        <label>Confirm Password *</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input 
                                name="confirmPassword" 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm your password" 
                                value={form.confirmPassword} 
                                onChange={handleChange} 
                                required 
                                style={{ flex: 1, paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
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
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && <div className="error-msg" style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{errors.confirmPassword}</div>}
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                
                <p style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--gray-600)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Login here</Link>
                </p>
            </div>

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
                    <span style={{ fontSize: '20px' }}>🎉</span>
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default RegisterPage;