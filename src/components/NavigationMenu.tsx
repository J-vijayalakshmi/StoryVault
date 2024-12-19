import React from "react";

import "../styles/NavigationMenu.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom


function NavigationMenu(){

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleHeadingClick = () => {
    navigate("/landingpage"); // Navigate to the landing page
  };

    return(
        <header>
        <div className="heading">
          <h1 onClick={handleHeadingClick}>StoryVault</h1>
          <p className="caption" >Where Every Story Finds a Home</p>
        </div>
        <div className="nav">
          <img src="./collection/user.png" alt="user"  />
          <div className="ips">
            <button type="button"><img src="./collection/search.png" alt="search"/></button>
            <input type="search" name="element" id="ele" placeholder="Search..."/>
          </div>
        </div>
      </header>
    );
}

export default NavigationMenu;