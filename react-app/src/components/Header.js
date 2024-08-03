import React from "react";
import "../styles/Header.css";

import hamburgerMenu from "../icons/hamburger-menu.svg";
import youtubeLogo from "../icons/youtube-logo.svg";
import search from "../icons/search.svg";
import voiceSearchIcon from "../icons/voice-search-icon.svg";
import upload from "../icons/upload.svg";
import youtubeApps from "../icons/youtube-apps.svg";
import notifications from "../icons/notifications.svg";
import currUserPic from "../channel-pics/my-channel.HEIC";

const Header = () => {
  return (
    <div className="header">
      <div className="left-section">
        <img className="hamburger-menu" src={hamburgerMenu} alt="Menu" />
        <img className="youtube-logo" src={youtubeLogo} alt="YouTube Logo" />
      </div>

      <div className="middle-section">
        <input className="search" type="text" placeholder="Search" />
        <button className="search-button">
          <img className="search-icon" src={search} alt="Search" />
        </button>
        <button className="voice-button">
          <img
            className="voice-icon"
            src={voiceSearchIcon}
            alt="Voice Search"
          />
        </button>
      </div>

      <div className="right-section">
        <img className="upload-icon" src={upload} alt="Upload" />
        <img className="apps-icon" src={youtubeApps} alt="Apps" />
        <img className="notif-icon" src={notifications} alt="Notifications" />
        <img
          className="curr-user-pic"
          src="channel-pics/my-channel.HEIC"
          alt="User"
        />
      </div>
    </div>
  );
};

export default Header;
