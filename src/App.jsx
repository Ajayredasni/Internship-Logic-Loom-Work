import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useState } from "react";
import "./App.css";

function App() {
  const [activeItem, setActiveItem] = useState("home");
  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}
    >
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="flex-grow-1 d-flex flex-column">
        <Navbar activeItem={activeItem} setActiveItem={setActiveItem} />

        <main
          className="flex-grow-1 p-0"
          style={{
            backgroundColor: "#f5f6fa",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
