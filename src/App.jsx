import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MovieGrid from "./MovieGrid";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Browser");
  const [searchQuery, setSearchQuery] = useState("");

  const handleMenuClick = (text) => {
    setActiveMenuItem(text);
  };

  return (
    <div className="min-h-screen text-white bg-gray-900">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          activeMenuItem={activeMenuItem} 
          handleMenuClick={handleMenuClick} 
        />

        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
          <MovieGrid searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default App;