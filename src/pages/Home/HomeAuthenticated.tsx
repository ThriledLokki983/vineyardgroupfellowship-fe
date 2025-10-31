import { useNavigate } from 'react-router-dom';

import { useAuthContext } from 'contexts/Auth/useAuthContext';

// import { useDailyMessage } from 'hooks/useDailyMessage';

import { Button, AlertBar } from 'components';

import styles from './HomePage.module.scss';

export default function HomeAuthenticated() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  // const { message: dailyMessage, isLoading: isDailyMessageLoading } = useDailyMessage()

  // Check if user needs to complete their profile
  const needsProfileUpdate = !user?.first_name || user.first_name.trim() === ''

  // Mock data - replace with real API calls using TanStack Query
  // const streak = 15
  const lastActive = 'Today at 9:42 AM'

  // TODO: Implement these features in future iterations
  // const quickActions = [
  //   {
  //     icon: '📊',
  //     title: 'View Dashboard',
  //     description: 'See your insights',
  //     action: () => navigate('/dashboard')
  //   },
  //   {
  //     icon: '👤',
  //     title: 'Update Profile',
  //     description: 'Manage your account',
  //     action: () => navigate('/profile')
  //   },
  //   {
  //     icon: '⚙️',
  //     title: 'Settings',
  //     description: 'Customize your experience',
  //     action: () => navigate('/settings')
  //   }
  // ]

  // const insights = [
  //   { value: `${streak} days`, label: 'Current Streak', trend: '+3 from last week' },
  //   { value: '87%', label: 'Weekly Check-In Rate', trend: 'Great consistency!' },
  //   { value: '12', label: 'Journal Entries', trend: '+5 this week' }
  // ]

  // const suggestedLearning = [
  //   {
  //     icon: '📖',
  //     title: 'Privacy Policy',
  //     excerpt: 'Learn how we protect your data and privacy'
  //   },
  //   {
  //     icon: '📋',
  //     title: 'Terms of Use',
  //     excerpt: 'Understand our community guidelines and terms'
  //   }
  // ]

  // const communityPosts = [
  //   {
  //     author: 'Anonymous User',
  //     timeAgo: '2 hours ago',
  //     content: 'Hit 30 days today. Never thought I\'d make it this far. Thank you all for the support. 🙏',
  //     reactions: 24
  //   },
  //   {
  //     author: 'Anonymous User',
  //     timeAgo: '5 hours ago',
  //     content: 'Having a tough day but reading everyone\'s stories keeps me going. We\'re all in this together.',
  //     reactions: 18
  //   }
  // ]

  const dailyQuote = "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would."

  return (
    <div className={styles.homePage}>
      {/* Profile Completion Alert */}
      {needsProfileUpdate && (
        <AlertBar variation="notice" possibleToClose={true}>
          <p>
            Help us personalize your experience by completing your profile.&nbsp;&nbsp;
            <a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
              Update Profile &nbsp;→
            </a>
          </p>
        </AlertBar>
      )}

      {/* Welcome Card */}
      <section className={styles.welcomeCard}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user?.first_name || user?.username || 'Friend'}
          </h1>
          <p className={styles.welcomeSubtitle}>
            Last active: {lastActive}
          </p>
        </div>
      </section>

      {/* Daily Encouragement */}
      <section className={styles.encouragementFooter}>
        <div className={styles.encouragementContent}>
          <p className={styles.encouragementLabel}>Daily Reflection</p>
          <blockquote className={styles.dailyQuote}>
            "{dailyQuote}"
          </blockquote>
          <Button
            variant="secondary"
            onPress={() => navigate('/profile')}
            style={{ marginTop: 'var(--size-4)' }}
          >
            Update Your Profile
          </Button>
        </div>
      </section>
    </div>
  )
}
