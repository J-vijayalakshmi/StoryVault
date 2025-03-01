import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Generes from "./components/Generes";
import WritePage from "./components/WritePage";
import MainPage from "./MainPage";
import LandingPage from "./components/LandingPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Routes>
        <Route path="/" element={<MainPage />} />   
        <Route path="/generes" element={<Generes />} />
        <Route path="/writepage" element={<WritePage />} />
        <Route path="/landingpage" element={<LandingPage />} />
      </Routes>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
