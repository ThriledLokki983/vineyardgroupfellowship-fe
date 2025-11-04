import { useCallback, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Tabs, TabList } from 'react-aria-components';
import { Button, Tab, TabPanel } from 'components';
import { supporterBackgroundPage } from 'src/signals/supporter-background-signals';
import type { SupporterBackgroundFormData } from 'src/schemas/supporterBackgroundSchema';
import { PersonalStoryStep } from './PersonalStoryStep';
import { AddictionTypesStep } from './AddictionTypesStep';
import { CredentialsStep } from './CredentialsStep';
import { SpecializationsStep } from './SpecializationsStep';
import { AvailabilityStep } from './AvailabilityStep';
import { CommunicationStep } from './CommunicationStep';
import { ReviewStep } from './ReviewStep';
import type { WizardStepId } from 'src/signals/supporter-background-signals';
import styles from '../SupporterBackground.module.scss';

interface BackgroundFormWizardProps {
  initialData?: Partial<SupporterBackgroundFormData>;
  mode: 'setup' | 'edit' | 'review';
  onSubmit: (data: SupporterBackgroundFormData) => void;
  isSubmitting?: boolean;
  submitError?: string;
}

interface WizardStep {
  id: WizardStepId;
  title: string;
  component: React.ComponentType<StepProps>;
  required: boolean;
}

interface StepProps {
  formData: Partial<SupporterBackgroundFormData>;
  onUpdate: (data: Partial<SupporterBackgroundFormData>) => void;
  onComplete: () => void;
  onEdit?: (stepId: WizardStepId) => void;
  mode?: 'setup' | 'edit' | 'review';
}

const WIZARD_STEPS: WizardStep[] = [
  { id: 'personal-story', title: 'Personal Story', component: PersonalStoryStep, required: true },
  { id: 'addiction-types', title: 'Experience Types', component: AddictionTypesStep, required: true },
  { id: 'credentials', title: 'Credentials', component: CredentialsStep, required: false },
  { id: 'specializations', title: 'Specializations', component: SpecializationsStep, required: false },
  { id: 'availability', title: 'Availability', component: AvailabilityStep, required: true },
  { id: 'communication', title: 'Communication', component: CommunicationStep, required: false },
  { id: 'review', title: 'Review', component: ReviewStep, required: false },
];

export function BackgroundFormWizard({
  initialData = {},
  mode = 'setup',
  onSubmit,
  isSubmitting = false,
  submitError
}: BackgroundFormWizardProps) {
  useSignals();

  // Load initial data into wizard signals on mount
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      supporterBackgroundPage.wizard.loadInitialData(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const updateFormData = useCallback((data: Partial<SupporterBackgroundFormData>) => {
    supporterBackgroundPage.wizard.updateFormData(data);
  }, []);

  const markStepComplete = useCallback((stepId: WizardStepId) => {
    supporterBackgroundPage.wizard.markStepComplete(stepId);
  }, []);

  const canAccessStep = (stepId: WizardStepId): boolean => {
    return supporterBackgroundPage.wizard.canAccessStep(stepId, mode);
  };

  const handleStepEdit = (stepId: WizardStepId) => {
    supporterBackgroundPage.wizard.selectTab(stepId);
  };

  const handleFinalSubmit = () => {
    const formData = supporterBackgroundPage.wizard.formData.value;
    const completedSteps = supporterBackgroundPage.wizard.completedSteps.value;

    // Validate that all required steps are completed
    const missingSteps = WIZARD_STEPS.filter(step =>
      step.required && !completedSteps.has(step.id)
    );

    if (missingSteps.length > 0) {
      // Navigate to first missing step
      supporterBackgroundPage.wizard.selectTab(missingSteps[0].id);
      return;
    }

    // Submit the form data
    onSubmit(formData as SupporterBackgroundFormData);
  };

  // Get signal values for rendering
  const selectedTab = supporterBackgroundPage.wizard.selectedTab.value;
  const formData = supporterBackgroundPage.wizard.formData.value;
  const completedSteps = supporterBackgroundPage.wizard.completedSteps.value;

  return (
    <div className={styles.wizardContainer}>
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => supporterBackgroundPage.wizard.selectTab(key as WizardStepId)}
        className={styles.wizardTabs}
      >
        <TabList aria-label="Background setup steps" className={styles.wizardTabList}>
          {WIZARD_STEPS.map((step, index) => (
            <Tab
              key={step.id}
              id={step.id}
              isDisabled={!canAccessStep(step.id)}
              stepNumber={index + 1}
              completed={completedSteps.has(step.id)}
            >
              {step.title}
            </Tab>
          ))}
        </TabList>

        {WIZARD_STEPS.map((step) => {
          const StepComponent = step.component;
          return (
            <TabPanel key={step.id} id={step.id}>
              <StepComponent
                formData={formData}
                onUpdate={updateFormData}
                onComplete={() => markStepComplete(step.id)}
                onEdit={handleStepEdit}
                mode={mode}
              />
            </TabPanel>
          );
        })}
      </Tabs>

      {/* Final submit section for review step */}
      {selectedTab === 'review' && (
        <div className={styles.stepActions}>
          <Button
            onPress={handleFinalSubmit}
            isDisabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Background Information'}
          </Button>
        </div>
      )}

      {submitError && (
        <div className="error-message" style={{ marginTop: 'var(--size-4)', textAlign: 'center' }}>
          {submitError}
        </div>
      )}
    </div>
  );
}