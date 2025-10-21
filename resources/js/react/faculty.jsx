import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './shared/Sidebar.jsx';
import AddFacultyModal from './components/AddFacultyModal.jsx';

// Faculty Bridge component to handle DOM manipulation
function FacultyBridge() {
  // Let the original faculty.js handle all functionality
  // Just ensure the content is moved into place
  useEffect(() => {
    // Move the existing faculty content into the React layout
    const contentWrapper = document.getElementById('faculty-content-wrapper');
    const contentContainer = document.getElementById('faculty-content-container');
    
    if (contentWrapper && contentContainer) {
      // Move all children from wrapper to container
      while (contentWrapper.firstChild) {
        contentContainer.appendChild(contentWrapper.firstChild);
      }
      
      // Dispatch custom event to let original faculty.js know content has been moved
      const event = new CustomEvent('facultyContentMoved');
      document.dispatchEvent(event);
    }
  }, []);
  
  return null;
}

function FacultyLayout() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Handle add faculty button click
  useEffect(() => {
    const handleAddFacultyClick = (e) => {
      if (e.target && e.target.id === 'addFacultyBtn') {
        e.preventDefault();
        e.stopPropagation();
        setIsAddModalOpen(true);
      }
    };

    // Add event listener to document to catch clicks on the add button
    document.addEventListener('click', handleAddFacultyClick);

    return () => {
      document.removeEventListener('click', handleAddFacultyClick);
    };
  }, []);

  const handleFacultyAdded = (newFaculty) => {
    // Refresh the page to show the new faculty
    window.location.reload();
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6fb', overflowX: 'auto' }}>
      <Sidebar active="faculty" width={280} />
      <div className="flex-grow-1">
        {/* Header */}
        <header style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderBottom: 'none'
        }}>
          <div className="d-flex align-items-center justify-content-between p-4">
            <div className="d-flex align-items-center">
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="fas fa-chalkboard-teacher text-white" style={{ fontSize: '18px' }}></i>
              </div>
              <div>
                <h2 className="m-0 text-white fw-bold" style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>Faculty</h2>
                <small className="text-white-50" style={{ fontSize: '14px' }}>Manage faculty records and information</small>
              </div>
            </div>
            
            <div className="dropdown">
              <button className="btn dropdown-toggle d-flex align-items-center gap-3" type="button" data-bs-toggle="dropdown" style={{
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
                <i className="fas fa-chevron-down" style={{ fontSize: '12px' }}></i>
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
                  <a className="dropdown-item d-flex align-items-center py-3 px-3" href="/profile" style={{ 
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div>
                      <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>Profile</div>
                      <small className="text-muted" style={{ fontSize: '12px' }}>View your account</small>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center py-3 px-3" href="/settings" style={{ 
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div>
                      <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>Settings</div>
                      <small className="text-muted" style={{ fontSize: '12px' }}>Manage preferences</small>
                    </div>
                  </a>
                </li>
                <li><hr className="dropdown-divider my-2" style={{ borderColor: 'rgba(0,0,0,0.1)' }} /></li>
                <li>
                  <a className="dropdown-item d-flex align-items-center py-3 px-3" href="/logout" style={{ 
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div>
                      <div className="fw-semibold text-danger" style={{ fontSize: '14px' }}>Logout</div>
                      <small className="text-muted" style={{ fontSize: '12px' }}>Sign out safely</small>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Faculty Content */}
        <div className="p-4" style={{ width: '100%' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            padding: '24px',
            border: '1px solid rgba(0,0,0,0.05)',
            overflowX: 'visible',
            height: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div id="faculty-content-container" style={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'visible',
              width: '100%'
            }}>
              {/* Faculty content will be moved here */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Faculty Modal */}
      <AddFacultyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFacultyAdded={handleFacultyAdded}
      />
    </div>
  );
}

export function mountFaculty() {
  const layoutContainer = document.getElementById('react-layout-root');
  if (!layoutContainer) {
    console.error('React layout container not found');
    return;
  }

  // Render the full layout with Header and Sidebar
  ReactDOM.render(<FacultyLayout />, layoutContainer);
  
  // Initialize the DOM bridge events after layout render
  const bridgeContainerId = 'react-faculty-bridge';
  let bridgeContainer = document.getElementById(bridgeContainerId);
  if (!bridgeContainer) {
    bridgeContainer = document.createElement('div');
    bridgeContainer.id = bridgeContainerId;
    document.body.appendChild(bridgeContainer);
  }
  ReactDOM.render(<FacultyBridge />, bridgeContainer);
}
