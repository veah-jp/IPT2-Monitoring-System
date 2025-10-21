import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './shared/Sidebar.jsx';

function AccountLayout() {
  const [moved, setMoved] = useState(false);

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

export function mountAccount() {
  let container = document.getElementById('react-layout-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'react-layout-root';
    document.body.prepend(container);
  }
  ReactDOM.render(<AccountLayout />, container);
}

document.addEventListener('DOMContentLoaded', mountAccount);


