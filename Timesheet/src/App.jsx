import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import LeaveForm from "./pages/LeaveForm"
import AdminForm from "./pages/AdminPage"
import ProtectedRoute from "./components/ProtectedRoute"
import "./index.css"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/applyLeave" element={
          <ProtectedRoute>
              <LeaveForm />
            </ProtectedRoute>
          } />
        <Route path="/admin11111" element={
          <ProtectedRoute>
            <AdminForm />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App