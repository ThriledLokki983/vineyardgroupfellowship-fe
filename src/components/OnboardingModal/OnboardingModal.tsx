import React, { useEffect, useRef } from 'react';
import { useSignals } from '@preact/signals-react/runtime'
import { Button } from 'react-aria-components';
import { Modal } from '../Modal';
import { useAuthContext } from '../../contexts/Auth/useAuthContext';
import { useAccountStatus } from '../../hooks/useAccountStatus';
import Icon from '../Icon';
import {
  api,
  type OnboardingStepValue,
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
    description: "A supportive community for your recovery journey. Connect with group leaders, track your progress, and find the support you need.",
    image: "/images/onboarding-1.png"
  },
  {
    id: 2,
    step: "profile_setup",
    title: "Your Fellowship Dashboard",
    description: "Access your recovery tracker, view your meetings, and stay connected with your group leader—all in one place.",
    image: "/images/onboarding-2.png"
  },
  {
    id: 3,
    step: "privacy_settings",
    title: "Privacy First",
    description: "Your journey is personal. We protect your privacy and you control what information you share with your group leader.",
    image: "/images/onboarding-3.png"
  },
  {
    id: 4,
    step: "recovery_goals",
    title: "Connect & Share",
    description: "Share your progress and milestones with your group leader. They're here to support you every step of the way.",
    image: "/images/onboarding-4.png"
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

  // Track time spent on each step
  const stepStartTime = useRef<number>(Date.now());

  /**
   * Get step number from onboarding step value
   */
  const getStepNumber = (stepValue: OnboardingStepValue): number => {
    const foundStep = onboardingSteps.find(s => s.step === stepValue);
    return foundStep ? foundStep.id : 1;
  };

  /**
   * Calculate time spent on current step in minutes
   */
  const getTimeSpentMinutes = (): number => {
    const timeSpentMs = Date.now() - stepStartTime.current;
    return Math.round(timeSpentMs / 60000); // Convert to minutes
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
        await api.updateOnboardingStep("completed", 0);
      } catch (stepError) {
        console.warn('Failed to track completion step:', stepError);
      }

      // Use the dedicated onboarding completion endpoint
      await api.completeOnboarding();

      // Update user state with new onboarding structure
      if (setUser && user) {
        setUser({
          ...user,
          onboarding: {
            completed: true,
            current_step: 'completed',
            progress_percentage: 100
          },
          onboarded: true // Keep legacy field for compatibility
        });
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
          setUser({
            ...user,
            onboarding: {
              completed: true,
              current_step: 'completed',
              progress_percentage: 100
            },
            onboarded: true
          });
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
   * Navigate to next step
   */
  const handleNext = async () => {
    // Get current step data before moving forward
    const currentStepData = onboardingSteps.find(s => s.id === onboarding.step.value);

    if (onboarding.step.value < onboardingSteps.length) {
      // Track current step completion before moving forward
      if (currentStepData) {
        try {
          const timeSpent = getTimeSpentMinutes();
          await api.updateOnboardingStep(currentStepData.step, timeSpent);
        } catch (error) {
          // Don't block user experience for tracking failures
          console.warn('Failed to track onboarding step:', error);
        }
      }

      // Move to next step
      onboarding.nextStep();

      // Reset step timer for new step
      stepStartTime.current = Date.now();
    } else {
      handleComplete();
    }
  };

  /**
   * Navigate to specific step
   */
  const handleStepClick = async (stepNumber: number) => {
    // Track current step before navigating
    const currentStepData = onboardingSteps.find(s => s.id === onboarding.step.value);
    if (currentStepData) {
      try {
        const timeSpent = getTimeSpentMinutes();
        await api.updateOnboardingStep(currentStepData.step, timeSpent);
      } catch (error) {
        // Don't block user experience for tracking failures
        console.warn('Failed to track onboarding step:', error);
      }
    }

    // Navigate to clicked step
    onboarding.step.value = stepNumber;

    // Reset step timer for new step
    stepStartTime.current = Date.now();
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
              isDisabled={onboarding.isLoading.value.value}
            >
              <span>
                {onboarding.isLoading.value.value ? 'Loading...' : onboarding.step.value < onboardingSteps.length ? 'Next' : 'Get Started'}
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