import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './utils/firebase'
import { useStore } from './store/bookStore'
import { LOCAL_STORAGE_KEYS } from './utils/constants'
import AppRouter from './routers/AppRouter'
import LoadingSpinner from './components/LoadingSpinner'
import MessageToast from './components/MessageToast'
import ToastContainer from './components/ToastContainer'
import './App.css'

function App() {
  const { setAuthUser, fetchBooks, fetchUserTrades, isLoading, checkAuthStatus } = useStore()

  useEffect(() => {
    // Check for existing JWT token and fetch user data if it exists
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)

    if (token && storedUser) {
      const user = JSON.parse(storedUser)
      setAuthUser(user)
      fetchUserTrades()
    }

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Clear token and user data if Firebase auth is lost
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
        setAuthUser(null)
      }
    })

    // Always fetch books regardless of auth status
    fetchBooks()

    checkAuthStatus()

    return () => unsubscribe()
  }, [setAuthUser, fetchBooks, fetchUserTrades, checkAuthStatus])

  if (isLoading.auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <AppRouter />
      <MessageToast />
      <ToastContainer />
    </div>
  )
}

export default App
