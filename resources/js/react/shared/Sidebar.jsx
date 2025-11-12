import React, { useEffect, useState } from 'react';

export default function Sidebar({ active = 'dashboard', width = 280 }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Handle sidebar toggle from external button
    const handleToggle = () => {
      setIsCollapsed(prev => !prev);
    };

    // Handle profile dropdown
    const handleProfileToggle = (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById('profile-dropdown-menu');
      if (dropdown) {
        dropdown.classList.toggle('show');
      }
    };

    // Close profile dropdown when clicking outside
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        const dropdown = document.getElementById('profile-dropdown-menu');
        if (dropdown) {
          dropdown.classList.remove('show');
        }
      }
    };

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsCollapsed(false);
        const dropdown = document.getElementById('profile-dropdown-menu');
        if (dropdown) {
          dropdown.classList.remove('show');
        }
      }
    };

    // Bind events
    const toggleButton = document.getElementById('sidebarToggle');
    const profileButton = document.getElementById('profile-menu-button');

    if (toggleButton) {
      toggleButton.addEventListener('click', handleToggle);
    }
    if (profileButton) {
      profileButton.addEventListener('click', handleProfileToggle);
    }

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    // Cleanup
    return () => {
      if (toggleButton) {
        toggleButton.removeEventListener('click', handleToggle);
      }
      if (profileButton) {
        profileButton.removeEventListener('click', handleProfileToggle);
      }
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Update main content margin when sidebar collapses
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (isCollapsed) {
        mainContent.classList.add('sidebar-collapsed');
      } else {
        mainContent.classList.remove('sidebar-collapsed');
      }
    }
  }, [isCollapsed]);
  return (
    <div
      style={{
        width: isCollapsed ? '70px' : width + 'px',
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        position: 'relative',
        transition: 'width 0.3s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      ></div>

      <div className="p-4" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="d-flex align-items-center mb-5"
          style={{
            padding: '15px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: '45px',
              height: '45px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: isCollapsed ? '0' : '12px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              padding: '5px',
            }}
          >
            <img src="/Father_Saturnino_Urios_University_logo.png" alt="FSUU Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          {!isCollapsed && (
            <div>
              <h6
                className="text-white mb-0 fw-bold"
                style={{ fontSize: '14px', lineHeight: '1.2' }}
              >
                Student & Faculty
              </h6>
              <small className="text-white-50" style={{ fontSize: '11px' }}>
                Management System
              </small>
            </div>
          )}
        </div>

        <nav className="nav flex-column">
          <a
            href="/dashboard-react"
            className={`nav-link text-white position-relative ${
              active === 'dashboard' ? 'active' : ''
            }`}
            style={{
              background:
                active === 'dashboard'
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'transparent',
              borderRadius: '12px',
              width: isCollapsed ? '70px' : width + 'px',
              height: '54px',
              padding: isCollapsed ? '15px' : '15px 25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              fontSize: '16px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              boxShadow:
                active === 'dashboard'
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)'
                  : 'none',
              border:
                active === 'dashboard'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : 'none',
              marginBottom: '8px',
              transition: 'all 0.3s ease',
            }}
            title={isCollapsed ? 'Dashboard' : ''}
          >
            {active === 'dashboard' && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, #10b981, #059669)',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                }}
              ></div>
            )}
            <i className={`fas fa-chart-pie ${isCollapsed ? '' : 'me-3'}`}></i>
            {!isCollapsed && <span className="fw-medium">Dashboard</span>}
          </a>

          <a
            href="/students-react"
            className={`nav-link text-white position-relative ${active === 'students' ? 'active' : ''}`}
            style={{
              background:
                active === 'students'
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'transparent',
              borderRadius: '12px',
              width: isCollapsed ? '70px' : width + 'px',
              height: '54px',
              padding: isCollapsed ? '15px' : '15px 25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              fontSize: '16px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              boxShadow:
                active === 'students'
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)'
                  : 'none',
              border:
                active === 'students'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : 'none',
              marginBottom: '8px',
              transition: 'all 0.3s ease',
            }}
            title={isCollapsed ? 'Students' : ''}
          >
            {active === 'students' && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, #10b981, #059669)',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                }}
              ></div>
            )}
            <i className={`fas fa-users ${isCollapsed ? '' : 'me-3'}`}></i>
            {!isCollapsed && <span className="fw-medium">Students</span>}
          </a>

          <a
            href="/faculty-react"
            className={`nav-link text-white position-relative ${active === 'faculty' ? 'active' : ''}`}
            style={{
              background:
                active === 'faculty'
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'transparent',
              borderRadius: '12px',
              width: isCollapsed ? '70px' : width + 'px',
              height: '54px',
              padding: isCollapsed ? '15px' : '15px 25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              fontSize: '16px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              boxShadow:
                active === 'faculty'
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)'
                  : 'none',
              border:
                active === 'faculty'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : 'none',
              marginBottom: '8px',
              transition: 'all 0.3s ease',
            }}
            title={isCollapsed ? 'Faculty' : ''}
          >
            {active === 'faculty' && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, #10b981, #059669)',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                }}
              ></div>
            )}
            <i className={`fas fa-chalkboard-teacher ${isCollapsed ? '' : 'me-3'}`}></i>
            {!isCollapsed && <span className="fw-medium">Faculty</span>}
          </a>

          <a
            href="/reports-react"
            className={`nav-link text-white position-relative ${active === 'reports' ? 'active' : ''}`}
            style={{
              background:
                active === 'reports'
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'transparent',
              borderRadius: '12px',
              width: isCollapsed ? '70px' : width + 'px',
              height: '54px',
              padding: isCollapsed ? '15px' : '15px 25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              fontSize: '16px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              boxShadow:
                active === 'reports'
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)'
                  : 'none',
              border:
                active === 'reports'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : 'none',
              marginBottom: '8px',
              transition: 'all 0.3s ease',
            }}
            title={isCollapsed ? 'Reports' : ''}
          >
            {active === 'reports' && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, #10b981, #059669)',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                }}
              ></div>
            )}
            <i className={`fas fa-chart-bar ${isCollapsed ? '' : 'me-3'}`}></i>
            {!isCollapsed && <span className="fw-medium">Reports</span>}
          </a>

          <a
            href="/settings-react"
            className={`nav-link text-white position-relative ${active === 'settings' ? 'active' : ''}`}
            style={{
              background:
                active === 'settings'
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'transparent',
              borderRadius: '12px',
              width: isCollapsed ? '70px' : width + 'px',
              height: '54px',
              padding: isCollapsed ? '15px' : '15px 25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              fontSize: '16px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              boxShadow:
                active === 'settings'
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)'
                  : 'none',
              border:
                active === 'settings'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : 'none',
              marginBottom: '8px',
              transition: 'all 0.3s ease',
            }}
            title={isCollapsed ? 'Settings' : ''}
          >
            {active === 'settings' && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, #10b981, #059669)',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                }}
              ></div>
            )}
            <i className={`fas fa-cog ${isCollapsed ? '' : 'me-3'}`}></i>
            {!isCollapsed && <span className="fw-medium">Settings</span>}
          </a>

          <a
            href="/account-react"
            className={`nav-link text-white position-relative ${active === 'account' ? 'active' : ''}`}
            style={{
              background:
                active === 'account'
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'transparent',
              borderRadius: '12px',
              width: isCollapsed ? '70px' : width + 'px',
              height: '54px',
              padding: isCollapsed ? '15px' : '15px 25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              fontSize: '16px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              boxShadow:
                active === 'account'
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)'
                  : 'none',
              border:
                active === 'account'
                  ? '1px solid rgba(255,255,255,0.1)'
                  : 'none',
              transition: 'all 0.3s ease',
            }}
            title={isCollapsed ? 'Account' : ''}
          >
            {active === 'account' && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, #10b981, #059669)',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                }}
              ></div>
            )}
            <i className={`fas fa-user ${isCollapsed ? '' : 'me-3'}`}></i>
            {!isCollapsed && <span className="fw-medium">Account</span>}
          </a>
        </nav>
      </div>
    </div>
  );
}


