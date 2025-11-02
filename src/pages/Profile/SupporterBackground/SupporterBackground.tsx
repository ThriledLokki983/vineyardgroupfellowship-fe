import { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { useNavigate } from 'react-router-dom';
import { Text } from 'react-aria-components';
import { Button } from '../../../components/Button/Button';
import Layout from '../../../components/Layout/Layout';
import { BackgroundFormWizard } from './components/BackgroundFormWizard';
import { BackgroundDisplay, type SupporterBackgroundData } from './components/BackgroundDisplay';
import { DocumentsView } from './components/DocumentsView';
import { useSupporterBackground, useSupporterStatus } from '../../../hooks/useSupporterBackground';
import { toast } from '../../../components/Toast';
import { supporterBackgroundPage } from '../../../signals/supporter-background-signals';
import type { SupporterBackgroundFormData } from '../../../schemas/supporterBackgroundSchema';
import { BASE_URL } from '../../../configs/api-configs';
import styles from './SupporterBackground.module.scss';

export default function SupporterBackground() {
  useSignals();

  const navigate = useNavigate();
  const {
    background,
    isLoading,
    isSubmitting,
    submitBackground,
    submitError,
    error,
  } = useSupporterBackground();

  const {
    backgroundCompleted,
    backgroundApproved,
    isPendingApproval,
  } = useSupporterStatus();

  // Debug logging
  useEffect(() => {
    console.log('🎯 SupporterBackground component mounted');
    console.log('📊 Background data:', background);
    console.log('⏳ Loading state:', isLoading);
    console.log('❌ Error state:', error);
  }, [background, isLoading, error]);

  // Transform professional credentials into documents format
  useEffect(() => {
    const backgroundData = background as SupporterBackgroundData;
    if (backgroundData?.professional_credentials) {
      const transformedDocuments = backgroundData.professional_credentials
        .filter(credential => credential.document_url || credential.document) // Only include credentials with documents
        .map((credential, index) => ({
          id: `credential-${index}`,
          name: credential.document_filename || credential.name || 'Document',
          type: credential.document_filename?.split('.').pop()?.toLowerCase() || 'pdf',
          url: credential.document_url?.startsWith('/')
            ? `${BASE_URL}${credential.document_url}`
            : credential.document_url || '#', // Make relative URLs absolute
          uploadedAt: credential.uploaded_at || new Date().toISOString(),
          size: undefined, // Size not available in current API response
        }));

      supporterBackgroundPage.setDocuments(transformedDocuments);
      console.log('📄 Transformed documents:', transformedDocuments);
    }
  }, [background]);

  useEffect(() => {
    if (background) {
      // If we have background data, show display mode by default
      supporterBackgroundPage.setMode('display');
    } else if (backgroundCompleted) {
      supporterBackgroundPage.setMode(backgroundApproved ? 'review' : 'edit');
    }
  }, [background, backgroundCompleted, backgroundApproved]);

  const handleSubmit = (data: SupporterBackgroundFormData) => {
    console.log('🎯 handleSubmit called with data:', data);

    submitBackground(data, {
      onSuccess: () => {
        console.log('✅ Background submitted successfully');
        toast.success(
          'Background Submitted!',
          'Your information has been submitted for review.'
        );
        navigate('/');
      },
      onError: (error) => {
        console.error('❌ Background submission failed:', error);
        toast.error(
          'Submission Failed',
          'Please check your information and try again.'
        );
      },
    });
  };

  const handleDocumentUpload = async (file: File) => {
    supporterBackgroundPage.startDocumentUpload();
    try {
      // TODO: Implement actual file upload to backend
      console.log('Uploading file:', file.name);

      // Simulate upload for now
      const mockDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'document',
        url: URL.createObjectURL(file), // Temporary URL for preview
        uploadedAt: new Date().toISOString(),
        size: file.size,
      };

      supporterBackgroundPage.addDocument(mockDocument);

      toast.success(
        'Document Uploaded!',
        `${file.name} has been uploaded successfully.`
      );
    } catch (error) {
      console.error('Document upload failed:', error);
      toast.error(
        'Upload Failed',
        'Failed to upload document. Please try again.'
      );
    } finally {
      supporterBackgroundPage.finishDocumentUpload();
    }
  };

  if (isLoading) {
    return (
      <Layout variant="default">
        <div className={styles.loadingState}>
          <Text>Loading your background information...</Text>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout variant="default">
        <div className={styles.errorState}>
          <Text>Failed to load background information. Please try again.</Text>
          <Button onPress={() => window.location.reload()} variant="secondary">
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  // Get signal values for rendering
  const mode = supporterBackgroundPage.mode.value;
  const activeTab = supporterBackgroundPage.activeTab.value;
  const documents = supporterBackgroundPage.documents.value;
  const isUploadingDocument = supporterBackgroundPage.isUploadingDocument.value.value;

  return (
    <Layout variant="default">
      <div className={styles.backgroundPage}>
        <div className={styles.pageHeader}>
          <h1>Supporter Background</h1>
          <Text className={styles.pageDescription}>
            {mode === 'setup' && 'Complete your background to start supporting others in their recovery journey.'}
            {mode === 'edit' && 'Update your background information.'}
            {mode === 'review' && 'Review your approved background information.'}
            {mode === 'display' && 'Your supporter background information.'}
          </Text>
        </div>

        {isPendingApproval && (
          <div className={styles.statusBanner}>
            <Text>
              📋 Your background is currently under review. You'll be notified once it's approved.
            </Text>
          </div>
        )}

        {backgroundApproved && (
          <div className={styles.approvedBanner}>
            <Text>
              ✅ Your background has been approved! You can now access all supporter features.
            </Text>
          </div>
        )}

        {/* Show tabs and content when we have data and in display mode */}
        {mode === 'display' && background ? (
          <>
            {/* Tab Navigation */}
            <div className={styles.tabNavigation}>
              <button
                className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
                onClick={() => supporterBackgroundPage.setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'documents' ? styles.active : ''}`}
                onClick={() => supporterBackgroundPage.setActiveTab('documents')}
              >
                Documents
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === 'details' ? (
                <BackgroundDisplay
                  background={background as SupporterBackgroundData}
                  onEdit={() => supporterBackgroundPage.setMode('edit')}
                />
              ) : (
                <DocumentsView
                  documents={documents}
                  onUploadDocument={handleDocumentUpload}
                  isUploading={isUploadingDocument}
                />
              )}
            </div>
          </>
        ) : (
          /* Show form wizard for setup/edit modes */
          <BackgroundFormWizard
            initialData={background as Partial<SupporterBackgroundFormData>}
            mode={mode === 'display' ? 'edit' : mode} // Convert display to edit for wizard
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError?.message}
          />
        )}

        <div className={styles.pageActions}>
          <Button
            onPress={() => navigate('/')}
						variant='tertiary'
          >
            Back to Home
          </Button>
        </div>
      </div>
    </Layout>
  );

};