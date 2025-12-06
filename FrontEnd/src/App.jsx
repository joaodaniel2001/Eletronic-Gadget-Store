import React, { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { Navigate, Route, Routes } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

// -- Pages -- //

// OverAll
import Home from './pages/All/Home'
import LoginPage from './pages/All/LoginPage'
import RegisterPage from './pages/All/RegisterPage'

const pagesList = [
  { label: '/home', to: <Home /> },
]

function App() {

  const { user } = useAuth()

  return (
    <div>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/user/register" element={<RegisterPage />} />

        {pagesList.map((item, i) => (
          <Route
            key={i}
            path={`${item.label}`}
            element={
              <PrivateRoute>
                <Navbar />
                <div className='content'>
                  {item.to}
                </div>
              </PrivateRoute>
            }
          />
        ))}

        {/* Redirecionamento 404 */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  )
}

export default App
