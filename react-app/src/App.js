import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

import MainFeed from "./components/MainFeed.js";
import Header from "./components/Header.js";

function App() {
  // Simple Effect to test API Configuration
  useEffect(() => {
    const testAPI = async () => {
      try {
        // fetch data from api
        const response = await axios.get("http://localhost:5000/api/test");
        if (response.status === 200) {
          console.log(response.data);
        } else {
          console.error("Error with API", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    testAPI();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* min-h-screen - app full height, flex-col - stack items vertically */}
      <Header />
      <MainFeed />
    </div>
  );
}

export default App;
