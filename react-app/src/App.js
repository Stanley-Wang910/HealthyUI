import React from "react";
import "./App.css";

import Header from "./components/Header.js";
import MainFeed from "./components/MainFeed.js";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* min-h-screen - app full height, flex-col - stack items vertically */}
      <Header />
      <MainFeed />
    </div>
  );
}

export default App;
