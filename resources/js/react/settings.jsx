import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './shared/Sidebar.jsx';

function SettingsLayout() {
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const wrapper = document.getElementById('settings-content-wrapper');
    const container = document.getElementById('react-settings-slot');
    if (wrapper && container && !moved) {
      const legacy = wrapper.querySelector('.dashboard-content');
      if (legacy) {
        container.appendChild(legacy);
        legacy.style.display = '';
        // Tweak legacy container spacing to fit React layout nicely
        const fluid = legacy.querySelector('.container-fluid');
        if (fluid) {
          fluid.style.paddingLeft = '0';
          fluid.style.paddingRight = '0';
        }
        const settingsContainer = legacy.querySelector('.settings-container');
        if (settingsContainer) {
          settingsContainer.style.background = 'transparent';
          settingsContainer.style.minHeight = 'unset';
          settingsContainer.style.padding = '0';
          settingsContainer.style.margin = '0';
        }
        const settingsWrapper = legacy.querySelector('.settings-wrapper');
        if (settingsWrapper) {
          settingsWrapper.style.background = 'transparent';
          settingsWrapper.style.boxShadow = 'none';
          settingsWrapper.style.borderRadius = '0';
          settingsWrapper.style.padding = '0';
          settingsWrapper.style.margin = '0 0 16px 0';
          settingsWrapper.style.border = 'none';
        }
        const tabNavigation = legacy.querySelector('.tab-navigation');
        if (tabNavigation) {
          tabNavigation.style.background = 'transparent';
          tabNavigation.style.boxShadow = 'none';
          tabNavigation.style.borderRadius = '0';
          tabNavigation.style.padding = '0';
          tabNavigation.style.margin = '0 0 16px 0';
          tabNavigation.style.border = 'none';
        }
        const settingsContent = legacy.querySelector('.settings-content');
        if (settingsContent) {
          settingsContent.style.background = 'transparent';
          settingsContent.style.boxShadow = 'none';
          settingsContent.style.borderRadius = '0';
          settingsContent.style.padding = '0';
          settingsContent.style.minHeight = 'unset';
          settingsContent.style.border = 'none';
        }
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent('settingsContentMoved'));
        }, 0);
        setMoved(true);
      }
    }
  }, [moved]);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6fb', overflowX: 'hidden' }}>
      <Sidebar active="settings" width={280} />
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
                <i className="fas fa-cog text-white" style={{ fontSize: '18px' }}></i>
              </div>
              <div>
                <h2 className="m-0 text-white fw-bold" style={{ fontSize: '28px' }}>Settings</h2>
                <small className="text-white-50" style={{ fontSize: '14px' }}>Manage system configuration</small>
              </div>
            </div>
            <div className="profile-dropdown">
              <button id="profile-menu-button" className="btn d-flex align-items-center gap-3" type="button" style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '32px', height: '32px', background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 'bold'
                }}>J</div>
                <span className="fw-medium">Jerremae</span>
                <i className="fas fa-chevron-down" style={{ fontSize: '12px' }}></i>
              </button>
              <ul id="profile-dropdown-menu" className="dropdown-menu dropdown-menu-end" style={{
                border: 'none', borderRadius: '20px', boxShadow: '0 30px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.3), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)',
                padding: '12px', background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(30px) saturate(1.5) brightness(1.1)',
                minWidth: '180px', width: '180px', marginTop: '12px', position: 'absolute', right: 0
              }}>
                <li>
                  <a className="dropdown-item d-flex align-items-center py-3 px-3" href="/profile" style={{ borderRadius: '12px' }}>
                    <div>
                      <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>Profile</div>
                      <small className="text-muted" style={{ fontSize: '12px' }}>View your account</small>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center py-3 px-3" href="/settings" style={{ borderRadius: '12px' }}>
                    <div>
                      <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>Settings</div>
                      <small className="text-muted" style={{ fontSize: '12px' }}>Manage preferences</small>
                    </div>
                  </a>
                </li>
                <li>
                  <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)', margin: '8px 12px' }}></div>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center py-3 px-3" href="/logout" style={{ borderRadius: '12px' }}>
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
            height: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ height: '100%', overflowY: 'auto', width: '100%' }}>
              <div id="react-settings-slot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mountSettings() {
  const container = document.getElementById('react-layout-root');
  if (!container) return;
  ReactDOM.render(<SettingsLayout />, container);
}

document.addEventListener('DOMContentLoaded', mountSettings);


