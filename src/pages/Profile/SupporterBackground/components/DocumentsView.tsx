import { Text } from 'react-aria-components';
import { Button } from '../../../../components/Button/Button';
import styles from './DocumentsView.module.scss';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size?: number;
}

interface DocumentsViewProps {
  documents: Document[];
  onUploadDocument?: (file: File) => void;
  isUploading?: boolean;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onUploadDocument,
  isUploading = false,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadDocument) {
      onUploadDocument(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.documentsView}>
      {/* Documents List */}
      <div className={styles.documentsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Professional Documents</h3>
          <div className={styles.uploadSection}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className={styles.fileInput}
              id="document-upload"
              disabled={isUploading}
            />
            <label htmlFor="document-upload" className={styles.uploadButton}>
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </label>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className={styles.emptyState}>
            <Text className={styles.emptyMessage}>
              No documents uploaded yet. Upload your professional credentials, certifications, or other relevant documents.
            </Text>
          </div>
        ) : (
          <div className={styles.documentsList}>
            {documents.map((document) => (
              <div
                key={document.id}
                className={styles.documentItem}
                onClick={() => window.open(document.url, '_blank')}
              >
                <div className={styles.documentInfo}>
                  <h4 className={styles.documentName}>{document.name}</h4>
                  <div className={styles.documentMeta}>
                    <Text className={styles.documentType}>{document.type.toUpperCase()}</Text>
                    {document.size && (
                      <Text className={styles.documentSize}>
                        {formatFileSize(document.size)}
                      </Text>
                    )}
                    <Text className={styles.uploadDate}>
                      Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onPress={() => window.open(document.url, '_blank')}
                  className={styles.viewButton}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note: Documents open in new tabs to avoid X-Frame-Options issues */}
      {documents.length > 0 && (
        <div className={styles.infoNote}>
          <Text className={styles.noteText}>
            📋 Click on any document to view it in a new tab
          </Text>
        </div>
      )}
    </div>
  );
};