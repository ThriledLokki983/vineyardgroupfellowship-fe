import { useAuthContext } from '../../../contexts/Auth/useAuthContext';
import { useDailyMessage } from '../../../hooks/useDailyMessage';
import { useGreeting } from '../../../hooks/useGreeting';
import type { DashboardState } from '../../../hooks/useDashboardState';
import Layout from '../../../components/Layout/Layout';
import DashboardCard from '../../../components/DashboardCard';
import styles from './SeekerDashboard.module.scss';

interface SeekerDashboardProps {
  dashboardState: DashboardState;
}

export default function SeekerDashboard({ dashboardState }: SeekerDashboardProps) {
  const { user } = useAuthContext();
  const greeting = useGreeting();
  const { message: dailyMessage, isLoading: messageLoading } = useDailyMessage();

  return (
    <Layout variant="default">
      <div className={styles.seekerDashboard}>
        {/* Header Section with Greeting and Daily Message */}
        <header className={styles.dashboardHeader}>
          <h1 className={styles.greeting}>
            {greeting}, {user?.first_name || 'friend'} 👋
          </h1>

          <div className={styles.dailyMessage}>
            {messageLoading ? (
              <p className={styles.messageText}>Loading your daily inspiration...</p>
            ) : (
              <>
                <p className={styles.messageText}>"{dailyMessage?.text}"</p>
                {dailyMessage?.author && (
                  <p className={styles.messageAuthor}>— {dailyMessage.author}</p>
                )}
              </>
            )}
          </div>
        </header>

        {/* Key Action Cards Grid */}
        <div className={styles.dashboardGrid}>
          {/* Your Journey Card */}
          <DashboardCard
            title="Your Journey"
            icon="🌱"
            illustration={<span style={{ fontSize: '64px' }}>📊</span>}
            message={
              dashboardState === 'first-visit-seeker'
                ? "You haven't logged any activity yet. Start your journey!"
                : "14 days clean • 3 goals in progress"
            }
            actionLabel="View Progress"
            onAction={() => console.log('Navigate to progress')}
          />

          {/* Community Card */}
          <DashboardCard
            title="Community"
            icon="🤝"
            illustration={<span style={{ fontSize: '64px' }}>💬</span>}
            message={
              dashboardState === 'first-visit-seeker'
                ? "No new posts in your group. Connect with others walking the same path."
                : "2 new messages • 5 friends checked in today"
            }
            actionLabel="Open Community"
            onAction={() => console.log('Navigate to community')}
          />

          {/* Goals Card */}
          <DashboardCard
            title="Goals"
            icon="🎯"
            illustration={<span style={{ fontSize: '64px' }}>✨</span>}
            message={
              dashboardState === 'first-visit-seeker'
                ? "Set your first goal to begin tracking progress."
                : "Morning meditation ✓ • Exercise pending • Journal pending"
            }
            actionLabel={dashboardState === 'first-visit-seeker' ? "Create Goal" : "Today's Goals"}
            onAction={() => console.log('Navigate to goals')}
            variant={dashboardState === 'first-visit-seeker' ? 'accent' : 'default'}
          />

          {/* Resources Card */}
          <DashboardCard
            title="Resources"
            icon="📚"
            illustration={<span style={{ fontSize: '64px' }}>🧠</span>}
            message="Browse recommended reads, videos, and coping strategies to stay inspired."
            actionLabel="Explore Resources"
            onAction={() => console.log('Navigate to resources')}
          />
        </div>

        {/* Motivation Footer */}
        <footer className={styles.dashboardFooter}>
          <div className={styles.motivationBox}>
            <span className={styles.motivationIcon}>💪</span>
            <p className={styles.motivationText}>
              70% of success is showing up — keep going!
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
