import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import PrivateRoute from "./components/PrivateRoute";

function App() {

  return (
    <div className="App">
      <h1>Notable</h1>
      <p>Welcome to your note-taking app!</p>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <footer>© 2023 Notable. All rights reserved.</footer>
    </div>
    
  )
}

export default App
