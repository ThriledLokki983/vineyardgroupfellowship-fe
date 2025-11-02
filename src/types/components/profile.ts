/**
 * Profile Component Types
 * Type definitions for profile-related components
 */

import type { SupporterBackgroundFormData } from 'src/schemas/supporterBackgroundSchema';

// Supporter Background Form Wizard
export interface BackgroundFormWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
  mode?: 'setup' | 'edit';
}

export interface WizardStep {
  id: string;
  title: string;
  component: React.ComponentType<BaseStepProps>;
}

// Base props for all wizard steps
export interface BaseStepProps {
  formData: Partial<SupporterBackgroundFormData>;
  onUpdate: (data: Partial<SupporterBackgroundFormData>) => void;
  onComplete: () => void;
  mode?: 'setup' | 'edit' | 'review';
}

// Individual Step Props (aliases for clarity)
export type SpecializationsStepProps = BaseStepProps;
export type AddictionTypesStepProps = BaseStepProps;
export type CommunicationStepProps = BaseStepProps;
export type AvailabilityStepProps = BaseStepProps;
export type PersonalStoryStepProps = BaseStepProps;
export type CredentialsStepProps = BaseStepProps;

export interface ReviewStepProps {
  formData: Partial<SupporterBackgroundFormData>;
  onUpdate: (data: Partial<SupporterBackgroundFormData>) => void;
  onComplete: () => void;
  onEdit?: (stepId: string) => void;
  mode?: 'setup' | 'edit' | 'review';
}

// Background Display
export interface BackgroundDisplayProps {
  background: SupporterBackgroundData;
  onEdit?: () => void;
  isEditable?: boolean;
}

// Documents
export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: number;
  url: string;
}

export interface DocumentsViewProps {
  documents: Document[];
  onUpload?: (file: File) => void;
  onDelete?: (documentId: string) => void;
}

// Supporter Background Data
export interface SupporterBackgroundData {
  specializations?: string[];
  addiction_types?: string[];
  communication_methods?: string[];
  availability?: string[];
  personal_story?: string;
  credentials?: string[];
  certifications?: string[];
  documents?: Document[];
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
}
