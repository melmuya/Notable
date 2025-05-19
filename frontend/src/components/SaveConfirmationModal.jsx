import React from 'react';
import './Modal.css';

const SaveConfirmationModal = ({ isOpen, onSave, onDiscard }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Save Changes?</h3>
        <p>You've made changes to this note. Would you like to save them before continuing?</p>
        <div className="modal-buttons">
          <button 
            className="confirm-button" 
            style={{ backgroundColor: '#10b981', color: 'white' }}
            onClick={onSave}
          >
            Save
          </button>
          <button 
            className="cancel-button" 
            onClick={onDiscard}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmationModal;