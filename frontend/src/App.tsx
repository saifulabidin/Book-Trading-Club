import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './utils/firebase'
import { useStore } from './store/bookStore'
import AppRouter from './routers/AppRouter'
import LoadingSpinner from './components/LoadingSpinner'
import ToastContainer from './components/ToastContainer'
import './App.css'

function App() {
  const { fetchBooks, isLoading, checkAuthStatus } = useStore()

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // If Firebase auth is lost, let checkAuthStatus handle the cleanup
        checkAuthStatus()
      }
    })

    // Always fetch books regardless of auth status
    fetchBooks()
    
    // Check authentication status (this will also handle fetchUserTrades if authenticated)
    checkAuthStatus()

    return () => unsubscribe()
  }, [fetchBooks, checkAuthStatus])

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
      <ToastContainer />
    </div>
  )
}

export default App
