import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
}

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },
                credentials: 'same-origin',
                body: JSON.stringify({ username, password, remember })
            });

            if (response.redirected) {
                window.location.href = response.url;
                return;
            }

            if (response.ok) {
                window.location.href = '/dashboard';
                return;
            }

            await response.text();
            setError('Invalid credentials or server error.');
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
            <div style={{
                maxWidth: '450px',
                width: '100%',
                margin: '0 auto'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '50%',
                        margin: '0 auto 24px',
                        padding: '20px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid rgba(255,255,255,0.3)'
                    }}>
                        <img src="/Father_Saturnino_Urios_University_logo.png" alt="FSUU Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '28px', marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Student & Faculty</h2>
                    <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '16px', margin: 0 }}>Management System</p>
                </div>

                {/* Login Card */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.4)'
                }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#333', textAlign: 'center' }}>Welcome Back</h3>
                    
                    {error ? (
                        <div style={{
                            padding: '12px 16px',
                            background: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '12px',
                            color: '#c33',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>{error}</div>
                    ) : null}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500', fontSize: '14px' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fas fa-user" style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#999',
                                    fontSize: '16px'
                                }}></i>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    autoFocus
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 44px',
                                        border: '2px solid #e8e8e8',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        transition: 'all 0.3s',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        backgroundColor: '#ffffff'
                                    }}
                                    onFocus={(e) => {e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';}}
                                    onBlur={(e) => {e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none';}}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500', fontSize: '14px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fas fa-lock" style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#999',
                                    fontSize: '16px'
                                }}></i>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 44px',
                                        border: '2px solid #e8e8e8',
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        transition: 'all 0.3s',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        backgroundColor: '#ffffff'
                                    }}
                                    onFocus={(e) => {e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';}}
                                    onBlur={(e) => {e.target.style.borderColor = '#e8e8e8'; e.target.style.boxShadow = 'none';}}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                style={{ marginRight: '8px', width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <label htmlFor="remember" style={{ color: '#666', fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}>Remember me</label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: submitting ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseEnter={(e) => !submitting && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)')}
                            onMouseLeave={(e) => !submitting && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)')}
                        >
                            {submitting ? (
                                <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Logging in...</>
                            ) : (
                                <>Login</>
                            )}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <a href="#" style={{ color: '#667eea', fontSize: '14px', textDecoration: 'none' }}>Forgot Username/Password?</a>
                    </div>
                </div>
            </div>
    );
}

export function mount(targetId = 'react-login-root') {
    const container = document.getElementById(targetId);
    if (!container) return;
    ReactDOM.render(<LoginForm />, container);
}

if (typeof window !== 'undefined') {
    window.SimpleLogin = window.SimpleLogin || {};
    window.SimpleLogin.mount = mount;
}

