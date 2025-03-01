import React from "react";
import "../styles/landingPage.css";

import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="overlay">
        <h1 className="title">StoryVault</h1>
        <p className="caption">Where Every Story Finds a Home</p>
        <div className="buttons">
          <button className="btn read-btn" onClick={()=> {
            navigate("generes");
          }}>
            Textual adventure
          </button>
          <button className="btn write-btn" onClick={()=>{
            navigate("Writepage");
          }}>
            Creative Contributor
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
