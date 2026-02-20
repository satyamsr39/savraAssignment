import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from "./pages/principal/Dashboard"
import TeacherAnalysis from "./pages/principal/TeacherAnalysis"
import CreatePrincipal from "./pages/CreatePrincipal"


import Login from './pages/Login'
import CreateActivity from './pages/teacher/CreateActivity'
import RoleBasedRoute from './routes/RoleBasedRoute'

import MyActivities from "./pages/teacher/MyActivities"

function App() {
  return (
    <Router>
      <div className="bg-red-400">
        <Routes>
          <Route path="/" element={<Login />} />

<Route
  path="/create-principal"
  element={<CreatePrincipal />}
/>


<Route
  path="/teacher/my"
  element={
    <RoleBasedRoute role="teacher">
      <MyActivities />
    </RoleBasedRoute>
  }
/>

          <Route
  path="/principal/dashboard"
  element={
    <RoleBasedRoute role="principal">
      <Dashboard />
    </RoleBasedRoute>
  }
/>

<Route
  path="/principal/analysis"
  element={
    <RoleBasedRoute role="principal">
      <TeacherAnalysis />
    </RoleBasedRoute>
  }
/>

          <Route
            path="/teacher/create"
            element={
              <RoleBasedRoute role="teacher">
                <CreateActivity />
              </RoleBasedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
