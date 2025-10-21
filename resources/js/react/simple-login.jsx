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
        <>
            <div className="bg-elements">
                <div className="floating-circle circle-1"></div>
                <div className="floating-circle circle-2"></div>
                <div className="floating-circle circle-3"></div>
            </div>
            <div className="login-container">
                <div className="profile-icon">
                    <i className="fas fa-user"></i>
                </div>

                <div className="login-card">
                    {error ? (
                        <div className="alert alert-danger" role="alert">{error}</div>
                    ) : null}

                    <form onSubmit={handleSubmit} id="loginForm">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Username</label>
                            <div className="input-container">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                    id="username"
                                    className="form-control"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-container">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    id="password"
                                    className="form-control"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>

                        <button type="submit" className="btn-login" disabled={submitting}>
                            {submitting ? 'LOGGING IN...' : 'LOGIN'}
                        </button>
                    </form>

                    <div className="forgot-link">
                        <a href="#">forgot Username/Password</a>
                    </div>
                </div>

                <div className="demo-accounts">
                    <h6>Demo Accounts Available</h6>
                    <div className="row text-center">
                        <div className="col-4">
                            <small className="text-muted d-block">Admin</small>
                            <small className="text-primary">jerremaeadmin</small>
                        </div>
                        <div className="col-4">
                            <small className="text-muted d-block">Student</small>
                            <small className="text-success">john.doe</small>
                        </div>
                        <div className="col-4">
                            <small className="text-muted d-block">Faculty</small>
                            <small className="text-warning">robert.wilson</small>
                        </div>
                    </div>
                    <div className="text-center mt-2">
                        <small className="text-muted">Password: password123 / student123 / faculty123</small>
                    </div>
                </div>
            </div>
        </>
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

