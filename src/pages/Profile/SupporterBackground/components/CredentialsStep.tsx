import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { RadioGroup, Label, TextField, Text } from 'react-aria-components';
import { Button } from '../../../../components/Button/Button';
import Radio from '../../../../components/Radio';
import Icon from '../../../../components/Icon';
import { supporterBackgroundPage } from '../../../../signals/supporter-background-signals';
import type { SupporterBackgroundFormData } from '../../../../schemas/supporterBackgroundSchema';
import { BASE_URL } from '../../../../configs/api-configs';
import styles from '../SupporterBackground.module.scss';

interface CredentialsStepProps {
  formData: Partial<SupporterBackgroundFormData>;
  onUpdate: (data: Partial<SupporterBackgroundFormData>) => void;
  onComplete: () => void;
  mode?: 'setup' | 'edit' | 'review';
}

export function CredentialsStep({ formData, onUpdate, onComplete, mode = 'setup' }: CredentialsStepProps) {
  useSignals(); // Subscribe to signal changes

  // Sync signals with formData on mount
  useEffect(() => {
    if (formData.has_professional_credentials !== undefined) {
      if (formData.has_professional_credentials) {
        supporterBackgroundPage.steps.credentials.hasCredentials.setTrue();
      } else {
        supporterBackgroundPage.steps.credentials.hasCredentials.setFalse();
      }
    }
    if (formData.professional_credentials?.length) {
      supporterBackgroundPage.steps.credentials.credentials.value = formData.professional_credentials;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only sync on mount

  // Extract signal values for rendering and useEffect dependencies
  const hasCredentials = supporterBackgroundPage.steps.credentials.hasCredentials.value.value;
  const credentials = supporterBackgroundPage.steps.credentials.credentials.value;

  useEffect(() => {
    onUpdate({
      has_professional_credentials: hasCredentials,
      professional_credentials: hasCredentials ? credentials.filter(c => c.name.trim()) : []
    });
  }, [hasCredentials, credentials, onUpdate]);

  const handleCredentialsChange = (value: string) => {
    const hasCredentialsBool = value === 'true';
    if (hasCredentialsBool) {
      supporterBackgroundPage.steps.credentials.hasCredentials.setTrue();
    } else {
      supporterBackgroundPage.steps.credentials.hasCredentials.setFalse();
      supporterBackgroundPage.steps.credentials.credentials.value = [{ name: '' }];
    }
  };

  const addCredential = () => {
    const currentCredentials = supporterBackgroundPage.steps.credentials.credentials.value;
    const currentFiles = supporterBackgroundPage.steps.credentials.credentialFiles.value;
    const currentUploading = supporterBackgroundPage.steps.credentials.uploadingFiles.value;

    supporterBackgroundPage.steps.credentials.credentials.value = [...currentCredentials, { name: '' }];
    supporterBackgroundPage.steps.credentials.credentialFiles.value = [...currentFiles, null];
    supporterBackgroundPage.steps.credentials.uploadingFiles.value = [...currentUploading, false];
  };

  const updateCredential = (index: number, value: string) => {
    const updated = [...supporterBackgroundPage.steps.credentials.credentials.value];
    updated[index] = { ...updated[index], name: value };
    supporterBackgroundPage.steps.credentials.credentials.value = updated;
  };

  const removeCredential = (index: number) => {
    const currentCredentials = supporterBackgroundPage.steps.credentials.credentials.value;
    const currentFiles = supporterBackgroundPage.steps.credentials.credentialFiles.value;
    const currentUploading = supporterBackgroundPage.steps.credentials.uploadingFiles.value;

    const updated = currentCredentials.filter((_, i) => i !== index);
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    const updatedUploading = currentUploading.filter((_, i) => i !== index);

    supporterBackgroundPage.steps.credentials.credentials.value = updated.length === 0 ? [{ name: '' }] : updated;
    supporterBackgroundPage.steps.credentials.credentialFiles.value = updatedFiles.length === 0 ? [null] : updatedFiles;
    supporterBackgroundPage.steps.credentials.uploadingFiles.value = updatedUploading.length === 0 ? [false] : updatedUploading;
  };  const handleFileUpload = async (index: number, file: File) => {
    const currentUploading = [...supporterBackgroundPage.steps.credentials.uploadingFiles.value];
    currentUploading[index] = true;
    supporterBackgroundPage.steps.credentials.uploadingFiles.value = currentUploading;

    try {
      // Convert file to base64 for storage
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Update the credential object with base64 document data
      const updatedCredentials = [...supporterBackgroundPage.steps.credentials.credentials.value];
      updatedCredentials[index] = {
        ...updatedCredentials[index],
        document: base64 // Store base64 data directly in document field
      };
      supporterBackgroundPage.steps.credentials.credentials.value = updatedCredentials;

      const updatedFiles = [...supporterBackgroundPage.steps.credentials.credentialFiles.value];
      updatedFiles[index] = file;
      supporterBackgroundPage.steps.credentials.credentialFiles.value = updatedFiles;

      console.log(`File uploaded successfully: ${file.name}`);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      const finalUploading = [...supporterBackgroundPage.steps.credentials.uploadingFiles.value];
      finalUploading[index] = false;
      supporterBackgroundPage.steps.credentials.uploadingFiles.value = finalUploading;
    }
  };

  // Get signal values for rendering
  const credentialFiles = supporterBackgroundPage.steps.credentials.credentialFiles.value;
  const uploadingFiles = supporterBackgroundPage.steps.credentials.uploadingFiles.value;

  if (mode === 'review') {
    return (
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h2>Professional Credentials</h2>
        </div>
        <div className={styles.reviewContent}>
          <p><strong>Has Professional Credentials:</strong> {hasCredentials ? 'Yes' : 'No'}</p>
          {hasCredentials && credentials.filter(c => c.name.trim()).length > 0 && (
            <ul className={styles.reviewList}>
              {credentials.filter(c => c.name.trim()).map((credential, index) => (
                <li key={index}>{credential.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Professional Credentials</h2>
        <Text slot="description">
          Do you have professional training, certifications, or education in addiction recovery or mental health?
        </Text>
      </div>

			<RadioGroup
        value={hasCredentials ? 'true' : 'false'}
        onChange={handleCredentialsChange}
        className={styles.radioGroup}
				aria-labelledby="Professional Credentials"
      >
        <Radio value="true" description="I have formal training or certification in addiction counseling, psychology, and social work.">
          Yes, I have professional credentials
        </Radio>
        <Radio value="false" description="My experience is primarily personal recovery and peer support">
          No, I do not have professional credentials
        </Radio>
      </RadioGroup>

      {hasCredentials && (
        <div className={styles.credentialsList}>
          <Label aria-labelledby="Your credentials">Your Credentials</Label>
          <Text slot="description">
            List your relevant licenses, certifications, degrees, or training programs.
          </Text>

          {credentials.map((credential, index) => (
            <div key={index} className={styles.credentialInput}>
              <TextField
                value={credential.name}
                onChange={(value) => updateCredential(index, value)}
              >
                <Label>Credential {index + 1}</Label>
                <input
                  type="text"
                  placeholder="e.g., Licensed Clinical Social Worker (LCSW)"
                  className="input"
                  value={credential.name}
                  onChange={(e) => updateCredential(index, e.target.value)}
                />
              </TextField>

              {/* File Upload Section */}
              <div className={styles.fileUploadSection}>
                <Label>Supporting Document (Optional)</Label>
                <div className={styles.fileUploadContainer}>
                  {/* Show existing document from API or uploaded file */}
                  {credential.document_filename || credential.document_url || credentialFiles[index] ? (
                    <div className={styles.uploadedFile}>
                      <Icon name="CheckMarkIcon" width={16} height={16} />
                      <span>
                        {credential.document_filename || credentialFiles[index]?.name || 'Document attached'}
                      </span>
                      {credential.document_url && (
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
                          className={styles.viewDocumentBtn}
                        >
                          View
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(index, file);
                          }
                        }}
                        className={styles.fileInput}
                        id={`file-upload-${index}`}
                        disabled={uploadingFiles[index]}
                      />
                      <label
                        htmlFor={`file-upload-${index}`}
                        className={`${styles.fileUploadLabel} ${uploadingFiles[index] ? styles.uploading : ''}`}
                      >
                        <Icon name="PlusIcon" width={16} height={16} />
                        {uploadingFiles[index] ? 'Uploading...' : 'Upload Document'}
                      </label>
                    </>
                  )}
                </div>
                <Text className={styles.fileHelpText}>
                  {credential.document_url ? null : ''}
                </Text>
              </div>

              {credentials.length > 1 && (
                <Button
                  onPress={() => removeCredential(index)}
									variant='tertiary'
                  className={styles.removeCredentialBtn}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button onPress={addCredential} className="btn btn-secondary" variant='tertiary'>
            Add Another Credential
          </Button>
        </div>
      )}

      <div className={styles.stepActions}>
        <Button
          onPress={onComplete}
          variant='primary'
        >
          Continue
        </Button>
      </div>
    </div>
  );
}