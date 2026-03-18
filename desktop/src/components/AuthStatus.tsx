import React, { useEffect, useState } from 'react'

export const AuthStatus: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkStatus = async () => {
    const status = await window.electronAPI.isLoggedIn()
    setIsLoggedIn(status)
    setIsLoading(false)
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const success = await window.electronAPI.login()
      if (success) {
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await window.electronAPI.logout()
    setIsLoggedIn(false)
  }

  if (isLoading) return <div className="auth-status-loading">Checking status...</div>

  return (
    <div className="auth-status-container">
      {isLoggedIn ? (
        <div className="auth-profile">
          <span className="auth-icon google">G</span>
          <span className="auth-text">Google Connected</span>
          <button className="auth-btn logout no-drag" onClick={handleLogout}>Disconnect</button>
        </div>
      ) : (
        <button className="auth-btn login google-login no-drag" onClick={handleLogin}>
          <span className="auth-icon google">G</span>
          Sign in with Google
        </button>
      )}
    </div>
  )
}
