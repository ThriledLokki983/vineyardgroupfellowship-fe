import { Button } from '../../../../components/Button/Button';
import type { SupporterBackgroundFormData } from '../../../../schemas/supporterBackgroundSchema';
import type { WizardStepId } from '../../../../signals/supporter-background-signals';
import { ADDICTION_TYPES_OPTIONS, SPECIALIZATIONS_OPTIONS, COMMUNICATION_METHODS_OPTIONS } from '../../../../schemas/supporterBackgroundSchema';
import styles from '../SupporterBackground.module.scss';

interface ReviewStepProps {
  formData: Partial<SupporterBackgroundFormData>;
  onUpdate: (data: Partial<SupporterBackgroundFormData>) => void;
  onComplete: () => void;
  onEdit?: (stepId: WizardStepId) => void;
  mode?: 'setup' | 'edit' | 'review';
}

export function ReviewStep({ formData, onEdit, mode = 'setup' }: ReviewStepProps) {
  const getAddicitionTypeLabel = (value: string) => {
    const option = ADDICTION_TYPES_OPTIONS.find(opt => opt.value === value);
    return option?.label || value;
  };

  const getSpecializationLabel = (value: string) => {
    const option = SPECIALIZATIONS_OPTIONS.find(opt => opt.value === value);
    return option?.label || value;
  };

  const getCommunicationMethodLabel = (value: string) => {
    const option = COMMUNICATION_METHODS_OPTIONS.find(opt => opt.value === value);
    return option?.label || value;
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Review Your Information</h2>
        <p>Please review all your information before submitting. You can edit any section by clicking the edit button.</p>
      </div>

      {/* Personal Story */}
      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionTitle}>
          Personal Recovery Story
          {onEdit && (
            <Button onPress={() => onEdit('personal-story')} className={styles.editButton}>
              Edit
            </Button>
          )}
        </div>
        <div className={styles.reviewContent}>
          <p>{formData.personal_recovery_story || 'No story provided'}</p>
        </div>
      </div>

      {/* Addiction Types */}
      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionTitle}>
          Addiction Types Experienced
          {onEdit && (
            <Button onPress={() => onEdit('addiction-types')} className={styles.editButton}>
              Edit
            </Button>
          )}
        </div>
        <div className={styles.reviewContent}>
          {formData.addiction_types_experienced && formData.addiction_types_experienced.length > 0 ? (
            <ul className={styles.reviewList}>
              {formData.addiction_types_experienced.map((type, index) => (
                <li key={index}>{getAddicitionTypeLabel(type)}</li>
              ))}
            </ul>
          ) : (
            <p>No types selected</p>
          )}
        </div>
      </div>

      {/* Professional Credentials */}
      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionTitle}>
          Professional Credentials
          {onEdit && (
            <Button onPress={() => onEdit('credentials')} className={styles.editButton}>
              Edit
            </Button>
          )}
        </div>
        <div className={styles.reviewContent}>
          <p><strong>Has Professional Credentials:</strong> {formData.has_professional_credentials ? 'Yes' : 'No'}</p>
          {formData.has_professional_credentials && formData.professional_credentials && formData.professional_credentials.length > 0 && (
            <ul className={styles.reviewList}>
              {formData.professional_credentials.map((credential, index) => (
                <li key={index}>{credential.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Specializations */}
      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionTitle}>
          Areas of Specialization
          {onEdit && (
            <Button onPress={() => onEdit('specializations')} className={styles.editButton}>
              Edit
            </Button>
          )}
        </div>
        <div className={styles.reviewContent}>
          {formData.specializations && formData.specializations.length > 0 ? (
            <ul className={styles.reviewList}>
              {formData.specializations.map((spec, index) => (
                <li key={index}>{getSpecializationLabel(spec)}</li>
              ))}
            </ul>
          ) : (
            <p>No specializations selected</p>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionTitle}>
          Support Availability
          {onEdit && (
            <Button onPress={() => onEdit('availability')} className={styles.editButton}>
              Edit
            </Button>
          )}
        </div>
        <div className={styles.reviewContent}>
          <p><strong>One-on-One Mentoring:</strong> {formData.available_for_one_on_one ? 'Yes' : 'No'}</p>
          <p><strong>Group Leadership:</strong> {formData.available_for_group_leadership ? 'Yes' : 'No'}</p>
          {formData.available_for_one_on_one && (
            <p><strong>Maximum Mentees:</strong> {formData.max_mentees || 'Not specified'}</p>
          )}
        </div>
      </div>

      {/* Communication */}
      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionTitle}>
          Communication Preferences
          {onEdit && (
            <Button onPress={() => onEdit('communication')} className={styles.editButton}>
              Edit
            </Button>
          )}
        </div>
        <div className={styles.reviewContent}>
          <p><strong>Time Zone:</strong> {formData.time_zone_availability || 'Not specified'}</p>
          <p><strong>Preferred Communication Methods:</strong></p>
          {formData.preferred_communication_methods && formData.preferred_communication_methods.length > 0 ? (
            <ul className={styles.reviewList}>
              {formData.preferred_communication_methods.map((method, index) => (
                <li key={index}>{getCommunicationMethodLabel(method)}</li>
              ))}
            </ul>
          ) : (
            <p>No preferences specified</p>
          )}
        </div>
      </div>

      {mode !== 'review' && (
        <div className={styles.stepActions}>
          <p style={{ textAlign: 'center', marginBottom: 'var(--size-4)', color: 'var(--text-secondary)' }}>
            By submitting this information, you confirm that it is accurate and agree to our supporter guidelines.
          </p>
        </div>
      )}
    </div>
  );
}