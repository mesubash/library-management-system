import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('libraryUser')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('libraryUser', JSON.stringify(userData))
    navigate('/dashboard')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('libraryUser')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)