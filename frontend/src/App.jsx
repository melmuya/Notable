import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import NewNote from "./pages/NewNote";
import "./App.css";

function App() {

  return (
    <div className="App">
      <main>
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
          <Route path="/new-note" 
            element={
              <PrivateRoute>
                <NewNote />
              </PrivateRoute>
            } 
          />
            {/* <Route path="/note/:noteId" 
              element={
                <PrivateRoute>
                  <NoteDetail />
                </PrivateRoute>
              } 
            /> */}
            {/* <Route path="/edit/:noteId" 
              element={
                <PrivateRoute>
                  <EditNote />
                </PrivateRoute>
            } 
          /> */}
          {/* <Route path="/logout" element={<Logout />} /> */}
        </Routes>
      </main>
      
      {/* <footer>© 2023 Notable. All rights reserved.</footer> */}
    </div>
    
  )
}

export default App
