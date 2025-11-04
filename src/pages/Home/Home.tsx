import { useEffect, useRef } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import Layout from '../../components/Layout/Layout';
import { useAuthContext } from '../../contexts/Auth/useAuthContext'
import { homePage } from '../../signals/page-signals';
import MinimalPublicHome from './MinimalPublicHome'
import MinimalAuthHome from './MinimalAuthHome'

function Home() {
  useSignals();
  const { user, refreshAccessToken } = useAuthContext()
  const hasCheckedRef = useRef(false)

  // Check for existing session on mount - only once
  useEffect(() => {
    // Prevent duplicate calls (especially in StrictMode)
    if (hasCheckedRef.current) {
      return
    }
    hasCheckedRef.current = true

    const checkSession = async () => {
      // Try to restore session from httpOnly cookie if it exists
      await refreshAccessToken(true)
      homePage.finishAuthCheck()
    }

    checkSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run once on mount

  // Get signal value for rendering
  const isCheckingAuth = homePage.isCheckingAuth.value.value

  // Show minimal loading state while checking for session
  if (isCheckingAuth) {
    return (
      <Layout variant="centered">
        <div style={{ textAlign: 'center', padding: 'var(--size-8)' }}>
          <p>Loading...</p>
        </div>
      </Layout>
    )
  }

  // Render appropriate view based on authentication state
  return (
    <Layout variant="default">
      {user ? <MinimalAuthHome /> : <MinimalPublicHome />}
    </Layout>
  )
}

export default Home
