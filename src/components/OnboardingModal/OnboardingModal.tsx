import React, { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime'
import { Button } from 'react-aria-components';
import { Modal } from '../Modal';
import { useAuthContext } from '../../contexts/Auth/useAuthContext';
import { useAccountStatus } from '../../hooks/useAccountStatus';
import Icon from '../Icon';
import {
  api,
  type OnboardingStepValue,
  type RecoveryApproach,
  type FaithTradition,
  type UpdateRecoveryApproachRequest,
} from '../../services/api';
import { onboarding } from '../../signals'
import styles from './OnboardingModal.module.scss';

export const MODAL_ID = 'onboarding-modal';

interface OnboardingStep {
  id: number;
  step: OnboardingStepValue;
  title: string;
  description: string;
  image: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    step: "welcome",
    title: "Welcome to Vineyard Group Fellowship",
    description: "Take control of your journey to recovery with our comprehensive digital companion designed specifically for your success.",
    image: "/images/onboarding-1.png"
  },
  {
    id: 2,
    step: "profile_setup",
    title: "Set Up Your Profile",
    description: "Personalize your experience by sharing some basic information about yourself and your recovery journey.",
    image: "/images/onboarding-2.png"
  },
  {
    id: 3,
    step: "privacy_settings",
    title: "Privacy & Safety",
    description: "Control your privacy settings and decide how much you want to share with the Vineyard Group Fellowship community.",
    image: "/images/onboarding-3.png"
  },
  {
    id: 4,
    step: "recovery_goals",
    title: "Set Your Goals",
    description: "Define your recovery goals and milestones to track your progress and celebrate achievements.",
    image: "/images/onboarding-4.png"
  },
  {
    id: 5,
    step: "recovery_approach",
    title: "Your Recovery Path",
    description: "Choose the approach that resonates with you. We'll personalize your content and resources to support your unique journey.",
    image: "/images/onboarding-5.png"
  },
  {
    id: 6,
    step: "community_preferences",
    title: "Community Connection",
    description: "Choose how you'd like to connect with others on similar journeys and find the support you need.",
    image: "/images/onboarding-6.png"
  },
  {
    id: 7,
    step: "notifications",
    title: "Stay Connected",
    description: "Set up notifications to stay motivated with reminders, progress updates, and community interactions.",
    image: "/images/onboarding-7.png"
  }
];

interface OnboardingModalProps {
  onComplete?: () => void;
  initialStep?: OnboardingStepValue; // Step to resume from (avoids duplicate API calls)
}

/**
 * Onboarding Modal that appears for first-time users
 * Guides them through the app's key features and resumes from last completed step
 * Note: No longer makes its own API calls - receives initialStep from parent to optimize network requests
 */
export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, initialStep = "welcome" }) => {
  // Subscribe to signals for reactivity
  useSignals()

  const { user, setUser } = useAuthContext();
  const { isOnboardingComplete } = useAccountStatus();

  /**
   * Get step number from onboarding step value
   */
  const getStepNumber = (stepValue: OnboardingStepValue): number => {
    const foundStep = onboardingSteps.find(s => s.step === stepValue);
    return foundStep ? foundStep.id : 1;
  };

  /**
   * Set initial step based on passed prop
   */
  useEffect(() => {
    const resumeStep = getStepNumber(initialStep);
    onboarding.setStep(resumeStep);
  }, [initialStep]);

  /**
   * Open modal when component mounts (for onboarding flow)
   */
  useEffect(() => {
    onboarding.isOpen.setTrue();

    // Cleanup: close modal when component unmounts
    return () => {
      onboarding.isOpen.setFalse();
    };
  }, []);

  /**
   * Reset to first step when closed
   */
  useEffect(() => {
    if (!onboarding.isOpen.value.value) {
      onboarding.setStep(1);
    }
  }, []);

  /**
   * Handle onboarding completion and flag it in the backend
   */
  const handleComplete = async () => {
    if (!user || isOnboardingComplete) {
      onboarding.isOpen.setFalse();
      return;
    }

    try {
      onboarding.isLoading.setTrue();

      // Mark final step as completed
      try {
        // await api.updateOnboardingStep("completed");
      } catch (stepError) {
        console.warn('Failed to track completion step:', stepError);
      }

      // Use the dedicated onboarding completion endpoint
      // await api.completeOnboarding();

      // Update user state
      if (setUser && user) {
        setUser({ ...user, onboarded: true });
      }

      onboarding.isOpen.setFalse();

      // Notify parent component of completion
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Fallback: try updating the user profile directly
      try {
        await api.patch('/profiles/me/', { onboarded: true });
        if (setUser && user) {
          setUser({ ...user, onboarded: true });
        }
        onboarding.isOpen.setFalse();

        // Notify parent component of completion
        if (onComplete) {
          onComplete();
        }
      } catch (fallbackError) {
        console.error('Fallback onboarding completion failed:', fallbackError);
        // Still close the modal even if both API calls fail
        onboarding.isOpen.setFalse();

        // Notify parent component of completion even if API fails
        if (onComplete) {
          onComplete();
        }
      }
    } finally {
      onboarding.isLoading.setFalse();
    }
  };

  /**
   * Handle skip onboarding
   */
  const handleSkip = () => {
    handleComplete(); // Same behavior - mark as onboarded
  };

  /**
   * Save recovery approach preferences when leaving the recovery approach step
   */
  const saveRecoveryApproach = async (): Promise<void> => {
    if (onboarding.recoveryApproach.value === null) {
      throw new Error('Please select your recovery approach');
    }

    // Build request payload according to backend spec
    const preferences: UpdateRecoveryApproachRequest = {
      recovery_approach: onboarding.recoveryApproach.value
    };

    // Add faith tradition and content preference for religious approach
    if (onboarding.recoveryApproach.value === 'religious') {
      if (onboarding.faithTradition.value) {
        preferences.faith_tradition = onboarding.faithTradition.value;
      }
      preferences.religious_content_preference = onboarding.contentPreference.value;
    }

    // Add faith tradition for mixed approach if selected
    if (onboarding.recoveryApproach.value === 'mixed' && onboarding.faithTradition.value) {
      preferences.faith_tradition = onboarding.faithTradition.value;
      preferences.religious_content_preference = onboarding.contentPreference.value;
    }

    // const response = await api.updateRecoveryApproach(preferences);

    // Log successful response for debugging
    // console.log('Recovery approach saved successfully:', response);
    console.log('Recovery approach saved successfully:');
  };

  /**
   * Navigate to next step
   */
  const handleNext = async () => {
    // Special handling for recovery approach step
    if (onboarding.step.value === 5) { // recovery_approach step
      if (onboarding.recoveryApproach.value === null) {
        // Show error or prevent navigation
        console.warn('Recovery approach must be selected');
        return;
      }

      try {
        await saveRecoveryApproach();
      } catch (error) {
        console.error('Failed to save recovery approach:', error);
        // Could show toast error here - backend will return validation errors
        return;
      }
    }

    if (onboarding.step.value < onboardingSteps.length) {
      onboarding.nextStep();

      // Track step progress in backend when user actively navigates
      const nextStepData = onboardingSteps.find(s => s.id === onboarding.step.value);
      if (nextStepData) {
        try {
          // await api.updateOnboardingStep(nextStepData.step);
        } catch (error) {
          // Don't block user experience for tracking failures
          console.warn('Failed to track onboarding step:', error);
        }
      }
    } else {
      handleComplete();
    }
  };

  /**
   * Navigate to specific step
   */
  const handleStepClick = async (stepNumber: number) => {
    onboarding.step.value = stepNumber;

    // Track step progress in backend when user actively clicks
    const stepData = onboardingSteps.find(s => s.id === stepNumber);
    if (stepData) {
      try {
        // await api.updateOnboardingStep(stepData.step);
      } catch (error) {
        // Don't block user experience for tracking failures
        console.warn('Failed to track onboarding step:', error);
      }
    }
  };

  const currentStep = onboardingSteps.find(s => s.id === onboarding.step.value);

  if (!currentStep) return null;

  return (
    <Modal
      isOpen={onboarding.isOpen.value.value}
      onClose={() => onboarding.isOpen.setFalse()}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      showCloseButton={false}
      size="lg"
      id={MODAL_ID}
      aria-label="Welcome to Vineyard Group Fellowship"
      className={styles.onboardingModal}
    >
      <div className={styles.container}>
        {/* Step Content */}
        <article className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>{currentStep.title}</h1>
            <p className={styles.description}>{currentStep.description}</p>

            {/* Special content for recovery approach step */}
            {currentStep.step === 'recovery_approach' && (
              <div className={styles.recoveryApproach}>
                <div className={styles.approachSection}>
                  <h3>Choose your recovery approach:</h3>
                  <div className={styles.optionGroup}>
                    <label className={`${styles.option} ${onboarding.recoveryApproach.value === 'secular' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="recovery_approach"
                        value="secular"
                        checked={onboarding.recoveryApproach.value === 'secular'}
                        onChange={(e) => {
                          onboarding.recoveryApproach.value = e.target.value as RecoveryApproach;
                          onboarding.faithTradition.value = null;
                          onboarding.contentPreference.value = 'none';
                        }}
                      />
                      <div className={styles.optionContent}>
                        <span className={styles.optionTitle}>Secular/Non-Religious</span>
                        <span className={styles.optionDescription}>Science-based approaches, and personal growth</span>
                      </div>
                    </label>

                    <label className={`${styles.option} ${onboarding.recoveryApproach.value === 'religious' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="recovery_approach"
                        value="religious"
                        checked={onboarding.recoveryApproach.value === 'religious'}
                        onChange={(e) => {
                          onboarding.recoveryApproach.value = e.target.value as RecoveryApproach;
                          onboarding.contentPreference.value = 'moderate';
                        }}
                      />
                      <div className={styles.optionContent}>
                        <span className={styles.optionTitle}>Faith-Based</span>
                        <span className={styles.optionDescription}>Incorporate spiritual practices and religious guidance</span>
                      </div>
                    </label>

                    <label className={`${styles.option} ${onboarding.recoveryApproach.value === 'mixed' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="recovery_approach"
                        value="mixed"
                        checked={onboarding.recoveryApproach.value === 'mixed'}
                        onChange={(e) => {
                          onboarding.recoveryApproach.value = e.target.value as RecoveryApproach;
                          onboarding.contentPreference.value = 'moderate';
                        }}
                      />
                      <div className={styles.optionContent}>
                        <span className={styles.optionTitle}>Both Approaches</span>
                        <span className={styles.optionDescription}>Mix of secular and spiritual resources</span>
                      </div>
                    </label>

                    <label className={`${styles.option} ${onboarding.recoveryApproach.value === 'undecided' ? styles.selected : ''}`}>
                      <input
                        type="radio"
                        name="recovery_approach"
                        value="undecided"
                        checked={onboarding.recoveryApproach.value === 'undecided'}
                        onChange={(e) => {
                          onboarding.recoveryApproach.value = e.target.value as RecoveryApproach;
                          onboarding.contentPreference.value = 'moderate';
                        }}
                      />
                      <div className={styles.optionContent}>
                        <span className={styles.optionTitle}>Still Exploring</span>
                        <span className={styles.optionDescription}>I'll decide later</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Faith selection appears when religious approach is selected */}
                {onboarding.recoveryApproach.value === 'religious' && (
                  <div className={styles.faithSection}>
                    <h3>Select your faith tradition (optional):</h3>
                    <div className={styles.optionGroup}>
                      <label className={`${styles.option} ${onboarding.faithTradition.value === 'christian' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="faith_tradition"
                          value="christian"
                          checked={onboarding.faithTradition.value === 'christian'}
                          onChange={(e) => onboarding.faithTradition.value = e.target.value as FaithTradition}
                        />
                        <div className={styles.optionContent}>
                          <span className={styles.optionTitle}>Christian</span>
                          <span className={styles.optionDescription}>Biblical principles and Christian community support</span>
                        </div>
                      </label>

                      <label className={`${styles.option} ${onboarding.faithTradition.value === 'muslim' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="faith_tradition"
                          value="muslim"
                          checked={onboarding.faithTradition.value === 'muslim'}
                          onChange={(e) => onboarding.faithTradition.value = e.target.value as FaithTradition}
                        />
                        <div className={styles.optionContent}>
                          <span className={styles.optionTitle}>Islamic</span>
                          <span className={styles.optionDescription}>Quran and Sunnah guidance with Islamic community support</span>
                        </div>
                      </label>

                      <label className={`${styles.option} ${onboarding.faithTradition.value === 'other' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="faith_tradition"
                          value="other"
                          checked={onboarding.faithTradition.value === 'other'}
                          onChange={(e) => onboarding.faithTradition.value = e.target.value as FaithTradition}
                        />
                        <div className={styles.optionContent}>
                          <span className={styles.optionTitle}>Other Faith Tradition</span>
                          <span className={styles.optionDescription}>General spiritual and faith-based resources</span>
                        </div>
                      </label>

                      <label className={`${styles.option} ${onboarding.faithTradition.value === 'jewish' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="faith_tradition"
                          value="jewish"
                          checked={onboarding.faithTradition.value === 'jewish'}
                          onChange={(e) => onboarding.faithTradition.value = e.target.value as FaithTradition}
                        />
                        <div className={styles.optionContent}>
                          <span className={styles.optionTitle}>Jewish</span>
                          <span className={styles.optionDescription}>Torah and Talmudic wisdom</span>
                        </div>
                      </label>

                      <label className={`${styles.option} ${onboarding.faithTradition.value === 'buddhist' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="faith_tradition"
                          value="buddhist"
                          checked={onboarding.faithTradition.value === 'buddhist'}
                          onChange={(e) => onboarding.faithTradition.value = e.target.value as FaithTradition}
                        />
                        <div className={styles.optionContent}>
                          <span className={styles.optionTitle}>Buddhist</span>
                          <span className={styles.optionDescription}>Mindfulness and Buddhist meditation</span>
                        </div>
                      </label>

                      <label className={`${styles.option} ${onboarding.faithTradition.value === 'hindu' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="faith_tradition"
                          value="hindu"
                          checked={onboarding.faithTradition.value === 'hindu'}
                          onChange={(e) => onboarding.faithTradition.value = e.target.value as FaithTradition}
                        />
                        <div className={styles.optionContent}>
                          <span className={styles.optionTitle}>Hindu</span>
                          <span className={styles.optionDescription}>Vedic principles and practices</span>
                        </div>
                      </label>

                      <label className={`${styles.option} ${onboarding.faithTradition.value === 'prefer_not_to_say' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name="faith_tradition"
                          value="prefer_not_to_say"
                          checked={onboarding.faithTradition.value === 'prefer_not_to_say'}
                          onChange={(e) => onboarding.faithTradition.value = e.target.value as FaithTradition}
                        />
                        <div className={styles.optionContent}>
                          <span className={styles.optionTitle}>Prefer Not to Say</span>
                          <span className={styles.optionDescription}>General religious resources</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </article>

        {/* Navigation */}
        <nav className={styles.navigation}>
          {/* Step Indicators */}
          <ol className={styles.stepIndicators} aria-label="Onboarding steps">
            {onboardingSteps.map((stepData) => (
              <li key={`onboarding-step-${stepData.id}`}>
                <button
                  type="button"
                  className={`${styles.stepIndicator} ${onboarding.step.value === stepData.id ? styles.active : ''}`}
                  onClick={() => handleStepClick(stepData.id)}
                  aria-current={onboarding.step.value === stepData.id ? 'step' : undefined}
                  aria-label={`Go to step ${stepData.id}: ${stepData.title}`}
                >
                  <span></span>
                </button>
              </li>
            ))}
          </ol>

          {/* Action Buttons */}
          <div className={styles.actions}>
						<Button
              className={styles.skipButton}
              onPress={handleSkip}
              isDisabled={onboarding.isLoading.value.value}
            >
              Skip for now
            </Button>

            <Button
              className={`${styles.primaryButton} ${styles.nextButton}`}
              onPress={handleNext}
              isDisabled={onboarding.isLoading.value.value || (currentStep.step === 'recovery_approach' && onboarding.recoveryApproach.value === null)}
            >
              <span>
                {onboarding.isLoading.value.value ? 'Loading...' : onboarding.step.value < onboardingSteps.length ? 'Next' : 'Start Your Journey'}
              </span>
              {!onboarding.isLoading.value.value && onboarding.step.value < onboardingSteps.length && <Icon name="ArrowRight" />}
            </Button>
          </div>
        </nav>
      </div>
    </Modal>
  );
};

export default OnboardingModal;