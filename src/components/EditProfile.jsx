import React, { useState, useContext } from "react";
import { MyContext } from "../contexts/MyContext";
import { removeToken } from "../utils/tokenUtils";
import apiClient from "../utils/axiosConfig";
import { API_CONFIG } from "../config/api";
import "./EditProfile.css";
import { getStates, getDistricts } from '../data/locations';
import SearchableSelect from './SearchableSelect';
import { useRef } from 'react';

const EditProfile = ({ isOpen, onClose }) => {
  const { user, setUser } = useContext(MyContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Editable fields
  const [firstname, setFirstname] = useState(user?.firstname || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [stateVal, setStateVal] = useState(user?.state || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [availableStates] = useState(() => getStates());
  const [availableDistricts, setAvailableDistricts] = useState(() => getDistricts(user?.state));
  const districtInputRef = useRef(null);

  // Passwords for confirmation / update
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);


  const handleDeleteUser = async () => {
    setDeleteError('');
    if (!deletePassword.trim()) {
      setDeleteError('Please enter your password to confirm deletion.');
      return;
    }

    if (deleteConfirmText.trim() !== 'DELETE') {
      setDeleteError('Type DELETE in the confirmation box to confirm permanent deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      const resp = await apiClient.delete(API_CONFIG.ENDPOINTS.USER.DELETE, {
        data: { password: deletePassword }
      });

      // Successful deletion
      if (resp && (resp.status === 200 || resp.status === 204)) {
        alert('Account deleted successfully.');
        removeToken();
        setUser(null);
        onClose();
        // Redirect to welcome/login page
        window.location.href = '/';
        return;
      }

      setDeleteError('Failed to delete account. Please try again.');
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data || error.response?.data?.message || 'Failed to delete account. Please try again.';
      setDeleteError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaveError('');
    if (!currentPassword.trim()) {
      setSaveError('Please enter your current password to save changes.');
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setSaveError('New password and confirm password do not match.');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare update payload with current password for verification
      const payload = {
        firstname,
        lastname,
        email,
        state: stateVal,
        district,
        // backend expects `password` on the User object; send newPassword if provided else currentPassword
        password: newPassword && newPassword.length ? newPassword : currentPassword
      };

      // Ensure no undefined properties
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      // Call update endpoint. Require a valid logged-in user with id.
      if (!user || !user.id) {
        setSaveError('You are not authenticated. Please login and try again.');
        setIsSaving(false);
        return;
      }

      const updateResp = await apiClient.put(`${API_CONFIG.ENDPOINTS.USER.UPDATE}/${user.id}`, payload);

      // Update local context
      const updatedUser = { ...updateResp.data };
      delete updatedUser.password;
      
      // Preserve token
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const { token } = JSON.parse(stored);
          if (token) updatedUser.token = token;
        } catch (err) {
          console.warn('Failed to parse stored user token', err);
        }
      }
      
      setUser(updatedUser);
      alert('Profile updated successfully');
      onClose();
    } catch (error) {
      // provide more detailed error info to help debugging
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        const message = error.response?.data?.message || JSON.stringify(error.response.data) || 'Failed to update profile.';
        setSaveError(message);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setSaveError('No response from server. Please check your network or server status.');
      } else {
        setSaveError(error.message || 'Failed to update profile.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="edit-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input 
                  type="text" 
                  value={firstname} 
                  onChange={(e) => setFirstname(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input 
                  type="text" 
                  value={lastname} 
                  onChange={(e) => setLastname(e.target.value)} 
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
          </div>

          {/* Location Information Section */}
          <div className="form-section">
            <h3>Location Information</h3>
            <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <SearchableSelect
                    options={availableStates}
                    value={stateVal}
                    onChange={(s) => {
                      setStateVal(s);
                      const dList = getDistricts(s);
                      setAvailableDistricts(dList);
                      // Do not auto-select a district; clear district and let user choose.
                      setDistrict('');
                      // focus district input if available
                      setTimeout(() => {
                        try { districtInputRef.current?.focus(); } catch { /* ignore focus failure */ }
                      }, 0);
                    }}
                    placeholder="Type or pick state"
                  />
                </div>
                <div className="form-group">
                  <label>District</label>
                  {availableDistricts && availableDistricts.length > 0 ? (
                    <SearchableSelect
                      options={availableDistricts}
                      value={district}
                      onChange={(d) => {
                        setDistrict(d);
                        // user will choose district explicitly; no city handling here
                      }}
                      inputRef={districtInputRef}
                      placeholder="Type or pick district"
                    />
                  ) : (
                    <>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Enter district"
                      />
                    </>
                  )}
                </div>
            </div>
            {/* city removed per request */}
          </div>

          {/* Password Section */}
          <div className="form-section">
            <h3>Password</h3>
            <p className="section-note">Enter your current password to save changes.</p>
            
            <div className="form-group">
              <label>Current Password *</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required
              />
            </div>
            
            {!showChangePassword ? (
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
            ) : (
              <div>
                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setShowChangePassword(false);
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                >
                  Cancel Password Change
                </button>
              </div>
            )}
          </div>

          {/* Error Messages */}
          {saveError && <div className="error-message">{saveError}</div>}

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              className="btn-primary"
              onClick={handleSave} 
              disabled={isSaving || !firstname.trim() || !lastname.trim() || !email.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="danger-zone">
          {!showDeleteConfirm ? (
            <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </button>
          ) : (
            <div className="delete-confirm">
              <p>Type <strong>DELETE</strong> and enter your password to permanently delete your account.</p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
              />
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Password"
              />
              {deleteError && <div className="error-message">{deleteError}</div>}
              <div className="delete-actions">
                <button className="btn-danger" onClick={handleDeleteUser} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button className="btn-secondary" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); setDeletePassword(''); setDeleteError(''); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
