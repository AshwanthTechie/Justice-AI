import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { MyContext } from "../contexts/MyContext";
import { getToken, removeToken } from "../utils/tokenUtils";
import apiClient from "../utils/axiosConfig";
import { API_CONFIG } from "../config/api";
import chatService from "../services/chatService";
import Chat from "./Chat";
import EditProfile from "./EditProfile";
import "./EditProfile.css";

function Home() {
  const { user, setUser } = useContext(MyContext);
  const [showEditProfile, setShowEditProfile] = React.useState(false);

  const handleLogout = async () => {
    try {
      const token = getToken();
      if (token) {
        await apiClient.post(API_CONFIG.ENDPOINTS.USER.LOGOUT, { token });
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      removeToken();
      setUser(null);
      alert("Logged out successfully!");
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      const token = getToken();
      if (token) {
        navigator.sendBeacon(`${apiClient.defaults.baseURL}${API_CONFIG.ENDPOINTS.USER.LOGOUT}`, JSON.stringify({ token }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleDeleteAllChats = async () => {
    if (window.confirm('Are you sure you want to delete all chats? This action cannot be undone.')) {
      try {
        await chatService.deleteAllChats();
        alert('All chats have been deleted successfully.');
        // Refresh the page to update the chat list
        window.location.reload();
      } catch (error) {
        console.error('Error deleting all chats:', error);
        alert('Failed to delete all chats. Please try again.');
      }
    }
  };



  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const openEditProfile = () => {
    setShowEditProfile(true);
    setShowProfileMenu(false);
  };

  // Close profile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.user-info')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  const closeEditProfile = () => {
    setShowEditProfile(false);
  };

  if (!user) {
    return (
      <div className="app">
        <div className="welcome-container">
          <div className="welcome-content">
            <h1>Welcome to JusticeAI</h1>
            <p>Your intelligent legal assistant</p>
            <Link to="/login">
              <button className="login-btn">Login to Continue</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>JusticeAI</h1>
        <div className="user-info">
          <div className="profile-image" onClick={toggleProfileMenu} title={user.firstname}>
            {user.firstname.charAt(0).toUpperCase()}
          </div>
          <span onClick={toggleProfileMenu} style={{cursor: 'pointer'}}>{user.firstname}</span>
          {showProfileMenu && (
            <div className="profile-menu">
              <button className="profile-menu-item" onClick={openEditProfile}>Edit Profile</button>
              <button onClick={handleDeleteAllChats} className="profile-menu-item">Delete All Chats</button>
              <button onClick={handleLogout} className="profile-menu-item logout-btn">Logout</button>
            </div>
          )}
        </div>
      </div>
      <Chat />
      <EditProfile isOpen={showEditProfile} onClose={closeEditProfile} />
    </div>
  );
}

export default Home;
