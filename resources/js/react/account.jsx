import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './shared/Sidebar.jsx';

function AccountLayout() {
  const [moved, setMoved] = useState(false);

  // Hide Bootstrap caret on dropdowns (global)
  useEffect(() => {
    const styleId = 'global-hide-dropdown-caret';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `.dropdown-toggle::after{display:none !important;}`;
      document.head.appendChild(style);
    }
  }, []);

  // Move legacy account content into the React slot and tweak styles
  useEffect(() => {
    const slot = document.getElementById('react-account-slot');
    const legacyContainer = document.querySelector('.account-container');
    if (slot && legacyContainer && !moved) {
      slot.appendChild(legacyContainer);
      const header = document.querySelector('.account-header');
      if (header) {
        header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
      // Hide legacy sidebar and header to avoid duplication
      const legacySidebar = document.querySelector('aside.sidebar');
      const legacyHeader = document.querySelector('.main-header');
      if (legacySidebar) legacySidebar.style.display = 'none';
      if (legacyHeader) legacyHeader.style.display = 'none';
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('accountContentMoved'));
      }, 0);
      setMoved(true);
    }
  }, [moved]);

  // Manual dropdown toggle since Bootstrap isn't working in React context
  useEffect(() => {
    const btn = document.querySelector('.dropdown .btn.dropdown-toggle');
    const menu = document.querySelector('.dropdown .dropdown-menu');
    if (!btn || !menu) return;

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle('show');
    };

    const handleOutside = (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
      }
    };

    btn.addEventListener('click', handleClick);
    document.addEventListener('click', handleOutside);

    return () => {
      btn.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleOutside);
    };
  }, []);

  // Replicate account.js functionality when legacy script is not present
  useEffect(() => {
    if (window.accountPage) return; // legacy JS already handling

    const getCsrf = () => {
      const m = document.querySelector('meta[name="csrf-token"]');
      return m ? m.getAttribute('content') : '';
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showNotification = (message, type = 'info') => {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => notification.classList.add('show'), 100);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    };

    const showLoadingState = (form, isLoading) => {
      const btn = form ? form.querySelector('button[type="submit"]') : null;
      if (!btn) return;
      if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
      } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText || btn.textContent || 'Submit';
      }
    };

    const showFieldError = (field, message) => {
      field.classList.add('is-invalid');
      let errorDiv = field.parentNode.querySelector('.invalid-feedback');
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.appendChild(errorDiv);
      }
      errorDiv.textContent = message;
    };

    const clearFieldError = (field) => {
      field.classList.remove('is-invalid');
      const errorDiv = field.parentNode.querySelector('.invalid-feedback');
      if (errorDiv) errorDiv.remove();
    };

    const validateProfileData = (data) => {
      if (data.first_name && data.first_name.trim().length < 2) {
        showNotification('First name must be at least 2 characters long', 'error');
        return false;
      }
      if (data.last_name && data.last_name.trim().length < 2) {
        showNotification('Last name must be at least 2 characters long', 'error');
        return false;
      }
      if (data.email && !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
      }
      return true;
    };

    const validatePasswordData = (data) => {
      if (!data.current_password || data.current_password.trim().length < 6) {
        showNotification('Current password is required', 'error');
        return false;
      }
      if (!data.new_password || data.new_password.trim().length < 6) {
        showNotification('New password must be at least 6 characters long', 'error');
        return false;
      }
      if (data.new_password !== data.confirm_password) {
        showNotification('New passwords do not match', 'error');
        return false;
      }
      return true;
    };

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((v, k) => (data[k] = v));
        if (!validateProfileData(data)) return;
        showLoadingState(form, true);
        const res = await fetch('/api/profile/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCsrf() },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
          showNotification('Profile updated successfully!', 'success');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showNotification(result.message || 'Error updating profile', 'error');
        }
      } catch (err) {
        showNotification('Error updating profile', 'error');
      } finally {
        showLoadingState(form, false);
      }
    };

    const handlePasswordChange = async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((v, k) => (data[k] = v));
        if (!validatePasswordData(data)) return;
        showLoadingState(form, true);
        const res = await fetch('/api/profile/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCsrf() },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
          showNotification('Password changed successfully!', 'success');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showNotification(result.message || 'Error changing password', 'error');
        }
      } catch (err) {
        showNotification('Error changing password', 'error');
      } finally {
        showLoadingState(form, false);
      }
    };

    const switchTab = (e) => {
      e.preventDefault();
      const targetTab = e.currentTarget.dataset.tab;
      const tabButtons = document.querySelectorAll('.account-tab-btn');
      const tabContents = document.querySelectorAll('.account-tab-content');
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const targetContent = document.getElementById(`${targetTab}Tab`);
      if (targetContent) targetContent.classList.add('active');
    };

    const addEntranceAnimations = () => {
      const elements = document.querySelectorAll('.account-card, .form-group');
      elements.forEach((el, idx) => {
        setTimeout(() => el.classList.add('fade-in'), idx * 100);
      });
    };

    const bind = () => {
      const profileForm = document.getElementById('profileForm');
      const changePasswordForm = document.getElementById('changePasswordForm');
      const tabButtons = document.querySelectorAll('.account-tab-btn');
      if (profileForm) profileForm.addEventListener('submit', handleProfileUpdate);
      if (changePasswordForm) changePasswordForm.addEventListener('submit', handlePasswordChange);
      tabButtons.forEach((btn) => btn.addEventListener('click', switchTab));

      // Real-time validation
      const inputs = document.querySelectorAll('.form-control');
      inputs.forEach((input) => {
        input.addEventListener('blur', () => {
          const name = input.name;
          const value = (input.value || '').trim();
          clearFieldError(input);
          let invalid = false;
          if ((name === 'first_name' || name === 'last_name') && value && value.length < 2) {
            invalid = true;
            showFieldError(input, 'Must be at least 2 characters long');
          } else if (name === 'email' && value && !isValidEmail(value)) {
            invalid = true;
            showFieldError(input, 'Please enter a valid email address');
          }
          if (!invalid) clearFieldError(input);
        });
        input.addEventListener('input', () => clearFieldError(input));
      });
    };

    bind();
    addEntranceAnimations();

    return () => {
      const profileForm = document.getElementById('profileForm');
      const changePasswordForm = document.getElementById('changePasswordForm');
      const tabButtons = document.querySelectorAll('.account-tab-btn');
      if (profileForm) profileForm.removeEventListener('submit', handleProfileUpdate);
      if (changePasswordForm) changePasswordForm.removeEventListener('submit', handlePasswordChange);
      tabButtons.forEach((btn) => btn.removeEventListener('click', switchTab));
    };
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6fb', overflowX: 'hidden' }}>
      <Sidebar active="account" width={280} />
      <div className="flex-grow-1">
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderBottom: 'none'
        }}>
          <div className="d-flex align-items-center justify-content-between p-4">
            <div className="d-flex align-items-center">
              <div style={{
                width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', backdropFilter: 'blur(10px)'
              }}>
                <i className="fas fa-user text-white" style={{ fontSize: '18px' }}></i>
              </div>
              <div>
                <h2 className="m-0 text-white fw-bold" style={{ fontSize: '28px' }}>Account</h2>
                <small className="text-white-50" style={{ fontSize: '14px' }}>Manage your profile and password</small>
              </div>
            </div>
            <div className="dropdown">
              <button className="btn dropdown-toggle d-flex align-items-center gap-3" type="button" data-bs-toggle="dropdown" aria-label="User menu" style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'white',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>J</div>
                <span className="fw-medium">Jerremae</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" style={{
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 30px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.3), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)',
                padding: '12px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(30px) saturate(1.5) brightness(1.1)',
                minWidth: '180px',
                width: '180px',
                marginTop: '12px',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(0)'
              }}>
                <li>
                  <a className="dropdown-item d-flex align-items-center py-3 px-3" href="/logout" style={{
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div>
                      <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>Logout</div>
                      <small className="text-muted" style={{ fontSize: '12px' }}>Sign out safely</small>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <div className="p-4" style={{ maxWidth: 'min(1600px, calc(100vw - 48px))', width: '100%', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            padding: '24px',
            border: '1px solid rgba(0,0,0,0.05)',
            overflowX: 'hidden',
            minHeight: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div id="react-account-slot" style={{ height: '100%', overflowY: 'auto', width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

let accountRoot = null;

export function mountAccount() {
  let container = document.getElementById('react-layout-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'react-layout-root';
    document.body.prepend(container);
  }
  
  // Use React 19's createRoot if available, otherwise fall back to legacy render
  if (!accountRoot) {
    if (ReactDOM.createRoot) {
      accountRoot = ReactDOM.createRoot(container);
      accountRoot.render(<AccountLayout />);
    } else {
      ReactDOM.render(<AccountLayout />, container);
    }
  } else {
    accountRoot.render(<AccountLayout />);
  }
}

document.addEventListener('DOMContentLoaded', mountAccount);


