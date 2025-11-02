import { useMemo, Fragment } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { useSearchParams, Link } from 'react-router-dom';

import { useAuthContext } from 'contexts/Auth/useAuthContext';
import type { DashboardState } from 'hooks/useDashboardState';

import type { User } from 'configs/hooks-interfaces';
import { PATH_GROUP_LEADER_BACKGROUND } from 'configs/paths';
import { useSupporterStatus } from 'hooks/useSupporterBackground';
import { useLeaderGroups } from 'hooks/useMyGroups';
import { useAllGroupsPendingRequests } from 'hooks/usePendingRequests';
import { modals } from 'signals/ui-signals';

import { Layout, Icon, AlertBar, CreateGroupModal } from 'components';
import DashboardCard from '../Cards/DashboardCard/DashboardCard';
import Action from '../Cards/ActionCard/Action';
import { PendingRequestCard } from '../Cards/PendingRequestCard';

import styles from './GroupLeaderDashboard.module.scss';

interface GroupLeaderDashboardProps {
  dashboardState: DashboardState
};

// Helper function to generate next steps message
const getNextStepsMessage = (supporterStatus: ReturnType<typeof useSupporterStatus>): React.ReactNode | null => {
  const {
    needsBackgroundSetup,
    isPendingApproval,
    needsTraining,
    nextRequiredStep,
    nextSteps,
    backgroundCompleted,
    backgroundApproved
  } = supporterStatus;

  // Priority order for next steps
  if (needsBackgroundSetup) {
    return (
      <>
        Complete your background setup to start helping others in their recovery journey.{' '}
        <Link to={PATH_GROUP_LEADER_BACKGROUND} style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
          Complete Setup Now →
        </Link>
      </>
    );
  }  if (isPendingApproval) {
    return "Your background is under review. We'll notify you once it's approved and you can start supporting others.";
  }

  if (needsTraining) {
    return "Complete your supporter training to unlock all support features and start helping others.";
  }

  // Check for specific next required step
  if (nextRequiredStep) {
    switch (nextRequiredStep) {
      case 'complete_background':
        return "Complete your background information to proceed with your supporter application.";
      case 'complete_training':
        return "Complete the required training to become an active supporter.";
      case 'verify_credentials':
        return "Verify your professional credentials to enhance your supporter profile.";
      case 'update_availability':
        return "Update your availability settings to start receiving support requests.";
      default:
        return `Next step: ${nextRequiredStep.replace(/_/g, ' ')}`;
    }
  }

  // Check for general next steps array
  if (nextSteps && nextSteps.length > 0) {
    const firstStep = nextSteps[0];
    // nextSteps is an array of strings, not objects
    return typeof firstStep === 'string' ? firstStep : null;
  }

  // If fully approved and active, show positive message
  if (backgroundCompleted && backgroundApproved) {
    return null; // No alert needed for fully active supporters
  }

  return null;
};


export const GroupLeaderDashboard = ({ dashboardState }: GroupLeaderDashboardProps) => {
  const { user } = useAuthContext();
  const [searchParams] = useSearchParams();

  const isWelcome = searchParams.get('welcome') === 'true';
  const isFirstLogin = searchParams.get('first_login') === 'true';

  {/* Render different content based on dashboard state */}
  const renderContent = (state: string)  => {
    switch (state) {
      case 'first-visit-supporter':
        return (
          <FirstVisitSupporterContent
            user={user}
            isWelcome={isWelcome}
            isFirstLogin={isFirstLogin}
          />
        );
      case 'active-supporter':
        return (
          <ActiveSupporterContent
            user={user}
          />
        );
      case 'returning-supporter':
        return (
          <ReturningSupporterContent
            user={user}
          />
        );
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
      <div className={styles.supporterDashboard}>
        {renderContent(dashboardState)}
      </div>
    </Layout>
  )
}

// First Visit Supporter Dashboard
const FirstVisitSupporterContent = ({ user, isWelcome, isFirstLogin }: {
  user: User | null,
  isWelcome: boolean,
  isFirstLogin: boolean
}) => {
  useSignals(); // Enable signals reactivity
  const supporterStatus = useSupporterStatus();
  const nextStepsMessage = getNextStepsMessage(supporterStatus);

  // Get group data from leadership_info
  const groupData = user?.leadership_info?.group || null;

  return (
    <>
      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={modals.createGroup.value.value}
        onClose={() => {modals.createGroup.setFalse()}}
        groupData={groupData}
        mode={groupData ? 'update' : 'create'}
      />

      {/* Next Steps Alert */}
      {nextStepsMessage && (
        <AlertBar variation="notice">
          <strong>Next Steps:</strong> {nextStepsMessage}
        </AlertBar>
      )}

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroIcon}>🤝</div>
        <h1 className={styles.heroTitle}>
          {isWelcome && isFirstLogin
            ? `Ready to Make a Difference${user?.first_name ? `, ${user.first_name}` : ''}? 🎉`
            : `Ready to Make a Difference${user?.first_name ? `, ${user.first_name}` : ''}?`
          }
        </h1>
        <p className={styles.heroSubtitle}>
          {isWelcome && isFirstLogin
            ? "Your account is verified and you're ready to lead! Your experience and compassion can help others find their path to recovery."
            : "Your experience and compassion can help others find their path to recovery. Let's get you set up to lead and support."
          }
        </p>
        {supporterStatus.needsBackgroundSetup ? (
          <Link to={PATH_GROUP_LEADER_BACKGROUND} className={styles.heroCta}>
            <Icon name="PersonOutlineIcon" />
            Complete Background Setup →
          </Link>
        ) : (
          <button className={styles.heroCta}>
            <Icon name="PersonOutlineIcon" />
            Complete Supporter Profile →
          </button>
        )}
      </div>

      {/* Action Cards */}
      <div className={styles.actionCardsGrid}>
        {supporterStatus.needsBackgroundSetup && (
          <div className={styles.actionCard}>
            <div className={styles.actionCardIcon}>📋</div>
            <h3 className={styles.actionCardTitle}>Complete Background Setup</h3>
            <p className={styles.actionCardDescription}>
              Share your recovery experience to help us match you with people you can best support
            </p>
            <Link to={PATH_GROUP_LEADER_BACKGROUND} className={styles.actionCardLink}>
              Get Started →
            </Link>
          </div>
        )}

        <div className={styles.actionCard}>
          <div className={styles.actionCardIcon}>✨</div>
          <h3 className={styles.actionCardTitle}>Create a Group</h3>
          <p className={styles.actionCardDescription}>
            Start a new fellowship group and lead others on their recovery journey
          </p>
          <button
            type="button"
            onClick={() => {modals.createGroup.setTrue()}}
            className={styles.actionCardLink}
            style={{ cursor: 'pointer' }}
          >
            Create Group →
          </button>
        </div>        <div className={styles.actionCard}>
          <div className={styles.actionCardIcon}>👥</div>
          <h3 className={styles.actionCardTitle}>Find Your Community</h3>
          <p className={styles.actionCardDescription}>
            Browse groups needing support and leadership from experienced members
          </p>
          <a href="#" className={styles.actionCardLink}>
            Explore →
          </a>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionCardIcon}>📋</div>
          <h3 className={styles.actionCardTitle}>Set Availability</h3>
          <p className={styles.actionCardDescription}>
            Define when and how you want to help others on their recovery journey
          </p>
          <a href="#" className={styles.actionCardLink}>
            Set Hours →
          </a>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.actionCardIcon}>🎓</div>
          <h3 className={styles.actionCardTitle}>Get Certified</h3>
          <p className={styles.actionCardDescription}>
            Complete leader training to unlock advanced support features
          </p>
          <a href="#" className={styles.actionCardLink}>
            Start →
          </a>
        </div>
      </div>

      {/* Leadership Resources */}
      <div className={styles.resourcesSection}>
        <div className={styles.resourcesIcon}>📖</div>
        <h2 className={styles.resourcesTitle}>Supporter Resources</h2>
        <p className={styles.resourcesDescription}>
          Training materials, best practices for peer support, and crisis intervention guidelines
        </p>
        <div className={styles.resourcesActions}>
          <button className={styles.resourcesButton}>
            <Icon name="EngagementIcon" />
            View Training →
          </button>
          <button className={styles.resourcesButtonSecondary}>
            <Icon name="HandIcon" />
            Best Practices →
          </button>
        </div>
      </div>
    </>
  )
}

// Group Leader Dashboard
const ActiveSupporterContent = ({ user }: { user: User | null }) => {
  useSignals(); // Enable signals reactivity
  const supporterStatus = useSupporterStatus();
  const nextStepsMessage = getNextStepsMessage(supporterStatus);
  const MissingFields = user?.profile_completeness?.missing_fields || [];
  const nextSteps = user?.supporter_info?.next_steps || [];

  // Get group data from leadership_info
  const groupData = user?.leadership_info?.group || null;
  const hasGroup = !!groupData;

  // Fetch leader groups and pending requests
  const { data: leaderGroups } = useLeaderGroups();
  const groupsWithNames = leaderGroups?.map((g) => ({ id: g.id, name: g.name })) || [];
  const { pendingRequests, totalPending, isLoading: isLoadingRequests } = useAllGroupsPendingRequests(groupsWithNames);

  return (
    <Fragment>
      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={modals.createGroup.value.value}
        onClose={() => {modals.createGroup.setFalse()}}
        groupData={groupData}
        mode={hasGroup ? 'update' : 'create'}
      />

      <Greetings userName={user?.first_name || user?.display_name_or_email || ''}/>

      {/* Next Steps Alert */}
      {nextStepsMessage && (
        <AlertBar variation="notice">
          <strong>Next Steps:</strong> {nextStepsMessage}
        </AlertBar>
      )}

      {/* Main Content Grid */}
      <div className={styles.mainContentGrid}>
        <DashboardCard
          emptyIconName='EmptyMailboxIcon'
          titleIconName='InboxIcon'
          title='Pending Actions'
          emptyMessage='You have no actions to take care of.'
          isEmpty={MissingFields.length <= 0 && nextSteps.length <= 0 && totalPending <= 0}
          isLoading={isLoadingRequests}
        >
          {/* Pending join requests */}
          {totalPending > 0 && (
            <div style={{ marginBottom: 'var(--size-4)' }}>
              <h4 style={{
                fontSize: 'var(--font-size-2)',
                fontWeight: 'var(--font-weight-6)',
                color: 'var(--brand-primary)',
                marginBottom: 'var(--size-3)'
              }}>
                Join Requests ({totalPending})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--size-3)' }}>
                {pendingRequests.map((item) => (
                  <PendingRequestCard
                    key={item.request.id}
                    request={item.request}
                    groupId={item.groupId}
                    groupName={item.groupName}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Missing profile fields */}
          {MissingFields.length > 0 && (
            <ol>
              {MissingFields.map((action, i) => (
                <li key={`${action}-${i}`}>
                  <Action action={action} type="missing"/>
                </li>
              ))}
            </ol>
          )}

          {/* Next steps */}
          {nextSteps && nextSteps.length > 0 && nextSteps.map((action, i) => (
              <ol key={`${action}-${i}`}>
                <li>
                  <Action action={action} type="support"/>
                </li>
              </ol>
          ))}
        </DashboardCard>
        <DashboardCard
          emptyIconName='EmptyGroupIcon'
          titleIconName='OutboxIcon'
          title='Your Group'
          emptyMessage='You have no groups yet. Create one to get started!'
          showActionButton={true}
          onActionClick={() => {
            console.log('[DashboardCard] Create/Update Group button clicked');
            console.log('[DashboardCard] Before setTrue:', modals.createGroup.value.value);
            modals.createGroup.setTrue();
            console.log('[DashboardCard] After setTrue:', modals.createGroup.value.value);
          }}
          isEmpty={!hasGroup}
          groupData={groupData}
        />
      </div>
    </Fragment>
  );

};

// Greetings Component - Could be moved to the components later
const Greetings = ({ userName }: { userName: string }) => {

  /**
   * Compose moment of day string.
   * Output: `morning`, `afternoon`, `evening`, `night`.
   */
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
        Good {moment} {userName ? `, ${userName}` : ''}!
      </h1>
    </div>
  );

};

// Returning Supporter Dashboard
const ReturningSupporterContent = ({ user }: { user: User | null }) => {
  const supporterStatus = useSupporterStatus();
  const { backgroundCompleted, backgroundApproved, needsBackgroundSetup } = supporterStatus;
  const nextStepsMessage = getNextStepsMessage(supporterStatus);

  return (
    <>
      {/* Next Steps Alert */}
      {nextStepsMessage && (
        <AlertBar variation="notice">
          <strong>Next Steps:</strong> {nextStepsMessage}
        </AlertBar>
      )}

      {/* Welcome Back Section */}
      <div className={styles.returningHero}>
        <div className={styles.returningIcon}>🌟</div>
        <h1 className={styles.returningTitle}>
          Welcome back{user?.first_name ? `, ${user.first_name}` : ''}!
        </h1>
        <p className={styles.returningSubtitle}>
          Your support makes a real difference. Let's continue helping others on their journey.
        </p>
        <button className={styles.returningCta}>
          <Icon name="PeopleIcon" />
          Check Your Community →
        </button>
      </div>

      {/* Quick Actions for Returning Supporters */}
      <div className={styles.quickActions}>
        <h2 className={styles.quickActionsTitle}>Jump back into helping</h2>
        <div className={styles.quickActionsGrid}>
          {needsBackgroundSetup && (
            <Link to={PATH_GROUP_LEADER_BACKGROUND} className={styles.quickActionCard}>
              <Icon name="PersonOutlineIcon" />
              <span>Complete Background</span>
            </Link>
          )}
          <button className={styles.quickActionCard}>
            <Icon name="PeopleIcon" />
            <span>Check Mentees</span>
          </button>
          <button className={styles.quickActionCard}>
            <Icon name="CelebrateIcon" />
            <span>Review Impact</span>
          </button>
          <button className={styles.quickActionCard}>
            <Icon name="EngagementIcon" />
            <span>Continue Training</span>
          </button>
        </div>
      </div>

      {/* Background Status Card for Returning Supporters */}
      {(needsBackgroundSetup || backgroundCompleted) && (
        <div className={styles.backgroundStatusSection}>
          <div className={styles.contentCard}>
            <h3 className={styles.contentCardTitle}>📝 Background Status</h3>
            <div className={styles.contentCardBody}>
              {needsBackgroundSetup ? (
                <>
                  <p>Complete your background to unlock all supporter features</p>
                  <Link to={PATH_GROUP_LEADER_BACKGROUND} className={styles.cardLink}>
                    Complete Setup →
                  </Link>
                </>
              ) : backgroundCompleted ? (
                <>
                  <div className={styles.statusItem}>
                    <span className={styles.statusIcon}>
                      {backgroundApproved ? '✅' : '⏳'}
                    </span>
                    <span>
                      {backgroundApproved ? 'Approved' : 'Under Review'}
                    </span>
                  </div>
                  <Link to={PATH_GROUP_LEADER_BACKGROUND} className={styles.cardLink}>
                    Update Info →
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );

};

export default GroupLeaderDashboard;