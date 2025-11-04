import { Fragment } from 'react';

import { useDashboardState } from 'hooks/useDashboardState';
import { useAuthContext } from 'contexts/Auth/useAuthContext';
import { useAccountStatus } from 'hooks/useAccountStatus';
import type { OnboardingStepValue } from 'services/api';

import GroupMemberDashboard from '../GroupMemberDashboard/GroupMemberDashboard';
import GroupLeaderDashboard from '../GroupLeaderDashboard/GroupLeaderDashboard';

import { Layout, Icon, LoadingState, OnboardingModal } from 'components';
import {
  LOADING_STATE,
  USER_PURPOSE_UNKNOWN,
  USER_PURPOSE_GROUP_LEADER,
  USER_PURPOSE_GROUP_MEMBER,
} from 'configs/constants';

import styles from './DashboardRouter.module.scss';


export default function DashboardRouter() {
  const { user } = useAuthContext();
  const { currentOnboardingStep } = useAccountStatus();
  const { state, userPurpose } = useDashboardState();

  if (state === LOADING_STATE) {
    return (
      <LoadingState
        icon="DashboardIcon"
        message="Loading your dashboard..."
        variant="centered"
      />
    );

  };

  // Onboarding required
  if (state === 'onboarding-required') {
    // Get initial step from new nested structure or fallback to legacy fields
    const initialStep = (user?.onboarding?.current_step as OnboardingStepValue) ||
      (currentOnboardingStep as OnboardingStepValue) ||
      (user?.onboarding_step as OnboardingStepValue) ||
      'welcome'

    return (
      <Fragment>
        <OnboardingModal
          onComplete={() => window.location.reload()}
          initialStep={initialStep}
        />
        <Layout variant="centered">
          <div className={styles.onboardingRequiredContainer}>
            <div className={styles.onboardingIcon}>
              <Icon name="CelebrateIcon" />
            </div>
            <h1 className={styles.onboardingTitle}>Welcome to Vineyard Group Fellowship!</h1>
            <p className={styles.onboardingSubtitle}>
              Complete your quick setup to get started on your personalized journey.
            </p>
          </div>
        </Layout>
      </Fragment>
    );

  };

  // Route to appropriate dashboard based on user purpose
  if (userPurpose === USER_PURPOSE_GROUP_LEADER) {
    return <GroupLeaderDashboard dashboardState={state} />;
  }

  if (userPurpose === USER_PURPOSE_GROUP_MEMBER) {
    return <GroupMemberDashboard dashboardState={state} />;
  }

  // Fallback for unknown user purpose - default to seeker experience
  if (userPurpose === USER_PURPOSE_UNKNOWN) {
    return <GroupMemberDashboard dashboardState={state} />
  }
}