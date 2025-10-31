import { Text } from 'react-aria-components';
import { Button } from 'components';
import type { SupporterBackgroundFormData } from 'src/schemas/supporterBackgroundSchema';
import { BASE_URL } from 'configs/api-configs';
import styles from './BackgroundDisplay.module.scss';

// Extended type for the API response data (same as in parent component)
export interface SupporterBackgroundData extends Omit<SupporterBackgroundFormData, 'professional_credentials'> {
  supporter_status: string;
  created_at: string;
  updated_at: string;
  professional_credentials: Array<{
    name: string;
    document?: string; // Base64 encoded document data (from form)
    document_url?: string | null; // URL from API response
    document_filename?: string | null;
    uploaded_at?: string | null;
  }>;
}

interface BackgroundDisplayProps {
  background: SupporterBackgroundData;
  onEdit: () => void;
}

// Helper functions to format the data
const formatAddictionTypes = (types: string[]) => {
  const uniqueTypes = [...new Set(types)]; // Remove duplicates
  const typeLabels: Record<string, string> = {
    alcohol: 'Alcohol',
    opioids: 'Opioids',
    cannabis: 'Cannabis',
    cocaine: 'Cocaine',
    stimulants: 'Stimulants',
    depressants: 'Depressants',
    gambling: 'Gambling',
    behavioral: 'Behavioral Addictions',
  };

  return uniqueTypes.map(type => typeLabels[type] || type);
};

const formatSpecializations = (specializations: string[]) => {
  const uniqueSpecs = [...new Set(specializations)]; // Remove duplicates
  const specLabels: Record<string, string> = {
    young_adults: 'Young Adults (18-25)',
    newcomer_support: 'Newcomer Support',
    workplace_issues: 'Workplace Issues',
    family_relationships: 'Family Relationships',
    trauma_informed: 'Trauma-Informed Care',
    dual_diagnosis: 'Dual Diagnosis',
    lgbtq_support: 'LGBTQ+ Support',
  };

  return uniqueSpecs.map(spec => specLabels[spec] || spec);
};

const formatSupporterStatus = (status: string) => {
  const statusLabels: Record<string, string> = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Needs Revision',
    suspended: 'Suspended',
  };

  return statusLabels[status] || status;
};

const formatCommunicationMethods = (methods: string[]) => {
  const uniqueMethods = [...new Set(methods)]; // Remove duplicates
  const methodLabels: Record<string, string> = {
    video_call: 'Video Calls',
    text_chat: 'Text Chat',
    voice_call: 'Voice Calls',
    email: 'Email',
    forum_messaging: 'Forum Messaging',
  };

  return uniqueMethods.map(method => methodLabels[method] || method);
};

export const BackgroundDisplay: React.FC<BackgroundDisplayProps> = ({
  background,
  onEdit,
}) => {
  return (
    <div className={styles.backgroundDisplay}>
      {/* Status Banner */}
      <div className={`${styles.statusBanner} ${styles[background.supporter_status]}`}>
        <Text className={styles.statusText}>
          Status: {formatSupporterStatus(background.supporter_status)}
        </Text>
      </div>

      {/* Personal Recovery Story */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Recovery Story</h3>
        <div className={styles.storyContainer}>
          <Text className={styles.storyText}>
            {background.personal_recovery_story}
          </Text>
        </div>
      </div>

      {/* Addiction Types */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Addiction Types Experienced</h3>
        <div className={styles.typesList}>
          {formatAddictionTypes(background.addiction_types_experienced).map((type, index) => (
            <Text key={index} className={styles.infoText}>
              {type}
            </Text>
          ))}
        </div>
      </div>

      {/* Professional Credentials */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Professional Credentials</h3>
        {background.has_professional_credentials ? (
          <div className={styles.credentialsContainer}>
            {background.professional_credentials?.map((credential, index: number) => (
              <div key={index} className={styles.credentialItem}>
                <div className={styles.credentialContent}>
                  <Text className={styles.credentialName}>{credential.name}</Text>
                  {credential.document_url && (
                    <div className={styles.credentialDocument}>
                      <Text className={styles.documentInfo}>
                        📄 {credential.document_filename || 'Document attached'}
                      </Text>
                      {credential.uploaded_at && (
                        <Text className={styles.uploadDate}>
                          Uploaded: {new Date(credential.uploaded_at).toLocaleDateString()}
                        </Text>
                      )}
                      <Button
                        variant="tertiary"
                        onPress={() => {
                          // Transform relative URLs to absolute URLs
                          const documentUrl = credential.document_url?.startsWith('/')
                            ? `${BASE_URL}${credential.document_url}`
                            : credential.document_url;
                          if (documentUrl) {
                            window.open(documentUrl, '_blank');
                          }
                        }}
                        className={styles.viewDocButton}
                      >
                        View Document
                      </Button>
                    </div>
                  )}
                  {credential.document && !credential.document_url && (
                    <div className={styles.credentialDocument}>
                      <Text className={styles.documentInfo}>
                        📄 Document (Base64 data)
                      </Text>
                      <Button
                        variant="tertiary"
                        onPress={() => {
                          // Create blob URL from base64 data
                          const byteCharacters = atob(credential.document!.split(',')[1] || credential.document!);
                          const byteNumbers = new Array(byteCharacters.length);
                          for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                          }
                          const byteArray = new Uint8Array(byteNumbers);
                          const blob = new Blob([byteArray], { type: 'application/pdf' });
                          const url = URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        }}
                        className={styles.viewDocButton}
                      >
                        View Document
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text className={styles.infoText}>No professional credentials</Text>
        )}
      </div>

      {/* Specializations */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Specializations</h3>
        <div className={styles.specializationsList}>
          {background.specializations && background.specializations.length > 0 ? (
            formatSpecializations(background.specializations).map((spec, index) => (
              <Text key={index} className={styles.infoText}>
                {spec}
              </Text>
            ))
          ) : (
            <Text className={styles.infoText}>No specializations specified</Text>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Availability</h3>
        <div className={styles.availabilityGrid}>
          <div className={styles.availabilityItem}>
            <Text className={styles.label}>One-on-One Support:</Text>
            <Text className={styles.value}>
              {background.available_for_one_on_one ? 'Available' : 'Not Available'}
            </Text>
          </div>
          <div className={styles.availabilityItem}>
            <Text className={styles.label}>Group Leadership:</Text>
            <Text className={styles.value}>
              {background.available_for_group_leadership ? 'Available' : 'Not Available'}
            </Text>
          </div>
          {background.available_for_one_on_one && background.max_mentees && (
            <div className={styles.availabilityItem}>
              <Text className={styles.label}>Maximum Mentees:</Text>
              <Text className={styles.value}>{background.max_mentees}</Text>
            </div>
          )}
        </div>
      </div>

      {/* Communication Preferences */}
      {background.preferred_communication_methods && background.preferred_communication_methods.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Communication Preferences</h3>
          <div className={styles.methodsList}>
            {formatCommunicationMethods(background.preferred_communication_methods).map((method, index) => (
              <Text key={index} className={styles.infoText}>
                {method}
              </Text>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Background Information</h3>
        <div className={styles.timestampGrid}>
          <div className={styles.timestampItem}>
            <Text className={styles.label}>Submitted:</Text>
            <Text className={styles.value}>
              {new Date(background.created_at).toLocaleDateString()}
            </Text>
          </div>
          <div className={styles.timestampItem}>
            <Text className={styles.label}>Last Updated:</Text>
            <Text className={styles.value}>
              {new Date(background.updated_at).toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className={styles.editSection}>
        <Button onPress={onEdit} variant="primary">
          Edit Background Information
        </Button>
      </div>
    </div>
  );
};