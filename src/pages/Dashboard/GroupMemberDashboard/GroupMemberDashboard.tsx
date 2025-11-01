/**
 * Group Member Dashboard
 * Displays dashboard content tailored for group members (non-leaders)
 */

import { Fragment, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/Auth/useAuthContext';
import { useDailyMessage } from '../../../hooks/useDailyMessage';
import { useMyGroups } from '../../../hooks/useMyGroups';
import type { DashboardState } from '../../../hooks/useDashboardState';
import type { User } from '../../../configs/hooks-interfaces';
import { Layout, Icon, AlertBar, BrowseGroupsModal } from 'components';
import DashboardCard from '../Cards/DashboardCard/DashboardCard';
import { GroupSummaryCard } from '../Cards/GroupSummaryCard';
import styles from './GroupMemberDashboard.module.scss';

interface GroupMemberDashboardProps {
  dashboardState: DashboardState;
}

export const GroupMemberDashboard = ({ dashboardState }: GroupMemberDashboardProps) => {
  const { user } = useAuthContext();
  const [searchParams] = useSearchParams();
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);

  const isWelcome = searchParams.get('welcome') === 'true';
  const isFirstLogin = searchParams.get('first_login') === 'true';

  console.log({ dashboardState });


  // Render different content based on dashboard state
  const renderContent = (state: string) => {
    switch (state) {
      case 'first-visit-seeker':
        return (
          <FirstVisitMemberContent
            user={user}
            isWelcome={isWelcome}
            isFirstLogin={isFirstLogin}
            onBrowseGroups={() => setIsBrowseModalOpen(true)}
          />
        );
      case 'active-seeker':
        return <ActiveMemberContent user={user} onBrowseGroups={() => setIsBrowseModalOpen(true)} />;
      case 'returning-seeker':
        return <ReturningMemberContent user={user} onBrowseGroups={() => setIsBrowseModalOpen(true)} />;
      default:
        return (
          <div className={styles.unknown}>
            <h2>Dashboard State Not Recognized</h2>
            <p>Please contact support if you believe this is an error.</p>
          </div>
        );
    }
  };

  return (
    <Layout variant="default">
      <div className={styles.memberDashboard}>{renderContent(dashboardState)}</div>
      <BrowseGroupsModal
        isOpen={isBrowseModalOpen}
        onClose={() => setIsBrowseModalOpen(false)}
      />
    </Layout>
  );
};

// First Visit Member Dashboard
const FirstVisitMemberContent = ({
  user,
  isWelcome,
  isFirstLogin,
  onBrowseGroups,
}: {
  user: User | null;
  isWelcome: boolean;
  isFirstLogin: boolean;
  onBrowseGroups: () => void;
}) => {
  const { message: dailyMessage, isLoading: messageLoading } = useDailyMessage();

  // TODO: Replace with actual data from API
  // const hasGroups = false;
  // const pendingRequestsCount = 0;

  return (
    <>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroIcon}>🤝</div>
        <h1 className={styles.heroTitle}>
          {isWelcome && isFirstLogin
            ? `Welcome to Your Fellowship Journey${user?.first_name ? `, ${user.first_name}` : ''}! 🎉`
            : `Welcome to Your Fellowship Journey${user?.first_name ? `, ${user.first_name}` : ''}!`}
        </h1>
        <p className={styles.heroSubtitle}>
          {isWelcome && isFirstLogin
            ? "Your account is verified and you're ready to connect! Find a group that resonates with you and start building meaningful relationships on your recovery path."
            : 'Connect with others walking the path to recovery. Find a group that supports your journey and build meaningful relationships.'}
        </p>
        <button className={styles.heroCta} onClick={onBrowseGroups}>
          <Icon name="SearchIcon" />
          Browse Groups →
        </button>
      </div>

      {/* Daily Message */}
      {!messageLoading && dailyMessage && (
        <div className={styles.dailyMessageSection}>
          <div className={styles.dailyMessageIcon}>💭</div>
          <div className={styles.dailyMessageContent}>
            <p className={styles.dailyMessageText}>"{dailyMessage.text}"</p>
            {dailyMessage.author && (
              <p className={styles.dailyMessageAuthor}>— {dailyMessage.author}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Cards Grid */}
      <div className={styles.actionCardsGrid}>
        {/* Find a Group - Primary Card */}
        <div className={styles.actionCard} data-featured="true">
          <div className={styles.actionCardIcon}>🔍</div>
          <h3 className={styles.actionCardTitle}>Find a Group</h3>
          <p className={styles.actionCardDescription}>
            Discover fellowship groups in your area or online that match your interests and recovery goals
          </p>
          <button type="button" className={styles.actionCardLink} onClick={onBrowseGroups}>
            Browse Groups →
          </button>
        </div>

        {/* Your Journey Card */}
        <div className={styles.actionCard}>
          <div className={styles.actionCardIcon}>🌱</div>
          <h3 className={styles.actionCardTitle}>Track Your Journey</h3>
          <p className={styles.actionCardDescription}>
            Start logging your progress and celebrate milestones along your recovery path
          </p>
          <button type="button" className={styles.actionCardLink}>
            Start Tracking →
          </button>
        </div>

        {/* Resources Card */}
        <div className={styles.actionCard}>
          <div className={styles.actionCardIcon}>📚</div>
          <h3 className={styles.actionCardTitle}>Explore Resources</h3>
          <p className={styles.actionCardDescription}>
            Browse recommended reads, videos, and coping strategies to stay inspired
          </p>
          <button type="button" className={styles.actionCardLink}>
            View Resources →
          </button>
        </div>

        {/* Set Goals Card */}
        <div className={styles.actionCard}>
          <div className={styles.actionCardIcon}>🎯</div>
          <h3 className={styles.actionCardTitle}>Set Your Goals</h3>
          <p className={styles.actionCardDescription}>
            Define your recovery goals and create a personalized plan to achieve them
          </p>
          <button type="button" className={styles.actionCardLink}>
            Create Goals →
          </button>
        </div>
      </div>

      {/* Motivation Footer */}
      <div className={styles.motivationSection}>
        <div className={styles.motivationIcon}>�</div>
        <p className={styles.motivationText}>
          Your recovery journey starts with a single step. You're not alone.
        </p>
      </div>
    </>
  );
};

// Active Member Dashboard
const ActiveMemberContent = ({ user, onBrowseGroups }: { user: User | null; onBrowseGroups: () => void }) => {
  // Fetch user's groups and filter by membership status
  const { data: myGroups, isLoading } = useMyGroups();

  const activeGroups = myGroups?.filter((g) => g.membership_status === 'active' || g.membership_status === 'leader' || g.membership_status === 'co_leader') || [];
  const pendingRequests = myGroups?.filter((g) => g.membership_status === 'pending') || [];

  const hasGroups = activeGroups.length > 0;
  const hasPendingRequests = pendingRequests.length > 0;

  return (
    <Fragment>
      <Greetings userName={user?.first_name || user?.display_name_or_email || ''} />

      {/* Pending Requests Alert */}
      {hasPendingRequests && (
        <AlertBar variation="notice">
          <strong>⏳ Pending Requests:</strong> You have {pendingRequests.length} group{' '}
          {pendingRequests.length === 1 ? 'request' : 'requests'} awaiting approval.
        </AlertBar>
      )}

      {/* Dashboard Cards Grid */}
      <div className={styles.mainContentGrid}>
        {/* My Groups Card */}
        <DashboardCard
          emptyIconName="EmptyGroupIcon"
          titleIconName="PeopleIcon"
          title="My Groups"
          emptyMessage="You haven't joined any groups yet. Find one to get started!"
          showActionButton={!hasGroups}
          actionButtonText="Browse Groups"
          onActionClick={onBrowseGroups}
          isEmpty={!hasGroups}
          isLoading={isLoading}
        >
          {hasGroups && (
            <div className={styles.groupsList}>
              {activeGroups.map((group) => (
                <GroupSummaryCard
                  key={group.id}
                  groupData={group}
                  showStatus={true}
                />
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Pending Requests Card */}
        <DashboardCard
          emptyIconName="EmptyMailboxIcon"
          titleIconName="ClockIcon"
          title="Pending Requests"
          emptyMessage="No pending group requests at the moment."
          isEmpty={!hasPendingRequests}
          isLoading={isLoading}
        >
          {hasPendingRequests && (
            <div className={styles.requestsList}>
              {pendingRequests.map((group) => (
                <GroupSummaryCard
                  key={group.id}
                  groupData={group}
                  showStatus={true}
                />
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Find More Groups Card */}
        <DashboardCard
          titleIconName="SearchIcon"
          title="Discover Groups"
          emptyMessage="Explore fellowship groups that match your interests."
          showActionButton={true}
          actionButtonText="Browse Groups"
          onActionClick={onBrowseGroups}
          isEmpty={false}
        >
          <p className={styles.discoverMessage}>
            Find groups in your area or online that support your recovery journey
          </p>
        </DashboardCard>

        {/* <DashboardCard
          titleIconName="StatsIcon"
          title="Your Journey"
          emptyMessage="Start tracking your progress today."
          isEmpty={false}
        >
          <p className={styles.journeyMessage}>Track milestones and celebrate your progress</p>
        </DashboardCard> */}
      </div>
    </Fragment>
  );
};

// Returning Member Dashboard
const ReturningMemberContent = ({ user, onBrowseGroups }: { user: User | null; onBrowseGroups: () => void }) => {
  // TODO: Replace with actual data from API
  // const hasGroups = false;
  const recentActivity = null;

  return (
    <>
      {/* Welcome Back Section */}
      <div className={styles.returningHero}>
        <div className={styles.returningIcon}>🌟</div>
        <h1 className={styles.returningTitle}>
          Welcome back{user?.first_name ? `, ${user.first_name}` : ''}!
        </h1>
        <p className={styles.returningSubtitle}>
          Continue your recovery journey with the support of your fellowship community.
        </p>
        <button className={styles.returningCta}>
          <Icon name="PeopleIcon" />
          View My Groups →
        </button>
      </div>

      {/* Quick Actions for Returning Members */}
      <div className={styles.quickActions}>
        <h2 className={styles.quickActionsTitle}>Pick up where you left off</h2>
        <div className={styles.quickActionsGrid}>
          <button className={styles.quickActionCard}>
            <Icon name="PeopleIcon" />
            <span>My Groups</span>
          </button>
          <button className={styles.quickActionCard} onClick={onBrowseGroups}>
            <Icon name="SearchIcon" />
            <span>Find Groups</span>
          </button>
          <button className={styles.quickActionCard}>
            <Icon name="StatsIcon" />
            <span>View Progress</span>
          </button>
          <button className={styles.quickActionCard}>
            <Icon name="HandIcon" />
            <span>Resources</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      {recentActivity && (
        <div className={styles.recentActivitySection}>
          <div className={styles.contentCard}>
            <h3 className={styles.contentCardTitle}>� Recent Activity</h3>
            <div className={styles.contentCardBody}>
              <p>Your recent group activities and updates</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Greetings Component
const Greetings = ({ userName }: { userName: string }) => {
  const moment = useMemo(() => {
    const time = new Date();
    const hours = time.getHours();
    if (hours > 4 && hours < 12) {
      return `morning`;
    }
    if (hours < 18) {
      return `afternoon`;
    }
    if (hours < 22) {
      return `evening`;
    }
    return `night`;
  }, []);

  return (
    <div className={styles.impactHeader}>
      <h1 className={styles.welcomeBack}>
        Good {moment}
        {userName ? `, ${userName}` : ''}! 👋
      </h1>
    </div>
  );
};

export default GroupMemberDashboard;
