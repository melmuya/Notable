import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";


function App() {

  return (
    <div className="App">
      <h1>Notable</h1>
      <p>Welcome to your note-taking app!</p>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <footer>© 2023 Notable. All rights reserved.</footer>
    </div>
    
  )
}

export default App
