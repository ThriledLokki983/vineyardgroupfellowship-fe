/**
 * Create Group Modal
 * Multi-step modal form for creating new fellowship groups
 */

import { useState, useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Button } from 'components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroup, updateGroup } from '../../services/groupApi';
import { createGroupSchema, createGroupDefaults, type CreateGroupFormData } from '../../schemas/createGroupSchema';
import { toast } from '../Toast';
import Modal from '../Modal';
import Icon from '../Icon';
import { Select, SelectItem } from '../Select';
import LocationAutocomplete from '../LocationAutocomplete';
import type { CreateGroupModalProps, GroupCreationStep } from 'types';
import styles from './CreateGroupModal.module.scss';

// Define steps for group creation

const groupCreationSteps: GroupCreationStep[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Give your group a name and describe its purpose"
  },
  {
    id: 2,
    title: "Location & Meetings",
    description: "Set up where and when your group will meet"
  },
  {
    id: 3,
    title: "Group Settings",
    description: "Configure member limits and group preferences"
  }
];

export default function CreateGroupModal({ isOpen, onClose, groupData = null, mode = 'create' }: CreateGroupModalProps) {
  useSignals(); // Enable signals reactivity

  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateGroupFormData>>(createGroupDefaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [currentFocusArea, setCurrentFocusArea] = useState('');

  const isUpdateMode = mode === 'update' && groupData;

  // Initialize form data with group data when in update mode
  useEffect(() => {
    if (isOpen && groupData && mode === 'update') {
      setFormData({
        name: groupData.name,
        description: groupData.description,
        location: groupData.location,
        location_type: groupData.location_type,
        meeting_time: groupData.meeting_time,
        meeting_day: groupData.meeting_day,
        meeting_frequency: groupData.meeting_frequency,
        is_open: groupData.is_open,
        member_limit: groupData.member_limit,
        focus_areas: groupData.focus_areas || [],
        visibility: groupData.visibility || 'public',
      });
      setFocusAreas(groupData.focus_areas || []);
    } else if (isOpen && mode === 'create') {
      resetForm();
    }
  }, [isOpen, groupData, mode]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast.success('Group created successfully!');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      onClose();
    },
    onError: (error: {response?: {data?: {detail?: string}}}) => {
      const errorMessage = error.response?.data?.detail || 'Failed to create group. Please try again.';
      toast.error(errorMessage);
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGroupFormData> }) =>
      updateGroup(id, data),
    onSuccess: () => {
      toast.success('Group updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      onClose();
    },
    onError: (error: {response?: {data?: {detail?: string}}}) => {
      const errorMessage = error.response?.data?.detail || 'Failed to update group. Please try again.';
      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData(createGroupDefaults);
    setErrors({});
    setFocusAreas([]);
    setCurrentFocusArea('');
    setCurrentStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : finalValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddFocusArea = () => {
    if (currentFocusArea.trim() && !focusAreas.includes(currentFocusArea.trim())) {
      const newFocusAreas = [...focusAreas, currentFocusArea.trim()];
      setFocusAreas(newFocusAreas);
      setFormData(prev => ({ ...prev, focus_areas: newFocusAreas }));
      setCurrentFocusArea('');
    }
  };

  const handleRemoveFocusArea = (area: string) => {
    const newFocusAreas = focusAreas.filter(a => a !== area);
    setFocusAreas(newFocusAreas);
    setFormData(prev => ({ ...prev, focus_areas: newFocusAreas }));
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: value
    }));

    // Clear error for location field
    if (errors.location) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Validate Basic Info
      if (!formData.name?.trim()) {
        newErrors.name = 'Group name is required';
      } else if (formData.name.length > 200) {
        newErrors.name = 'Group name must be 200 characters or less';
      }
    } else if (step === 2) {
      // Validate Location & Meetings
      if (!formData.location_type) {
        newErrors.location_type = 'Location type is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < groupCreationSteps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Navigate to specific step
  const handleStepClick = (stepNumber: number) => {
    // Allow going back but validate when going forward
    if (stepNumber < currentStep || validateStep(currentStep)) {
      setCurrentStep(stepNumber);
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const handleSubmit = async () => {
    // Validate all steps before submission
    if (!validateStep(currentStep)) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      // Validate with Zod
      const validatedData = createGroupSchema.parse(formData);

      // Submit to API - use appropriate mutation based on mode
      if (isUpdateMode && groupData) {
        updateGroupMutation.mutate({ id: groupData.id, data: validatedData });
      } else {
        createGroupMutation.mutate(validatedData);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as {errors: {path: string[]; message: string}[]};
        const newErrors: Record<string, string> = {};
        zodError.errors.forEach((err: {path: string[]; message: string}) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        toast.error('Please fix the errors in the form');
      }
    }
  };

  const handleClose = () => {
    if (createGroupMutation.isPending || updateGroupMutation.isPending) return;
    onClose();
  };

  const isLoading = createGroupMutation.isPending || updateGroupMutation.isPending;

  // const currentStepData = groupCreationSteps.find(s => s.id === currentStep);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isUpdateMode ? "Update Group" : "Create a new Group"}
      size="xl"
      isDismissable={!isLoading}
      className={styles.createGroupModal}
    >
      <div className={styles.container}>
        {/* Form Content */}
        <div className={styles.formContent}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              {/* Group Name */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Group Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="e.g., Young Adults Fellowship"
                  maxLength={200}
                  autoFocus
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Group Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                  placeholder="Describe your group's purpose and what members can expect..."
                  rows={6}
                />
                {errors.description && <span className={styles.error}>{errors.description}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Location & Meetings */}
          {currentStep === 2 && (
            <div className={styles.stepContent}>
              {/* Location Type */}
              <div className={styles.formGroup}>
                <Select
                  name="location_type"
                  label="Meeting Type"
                  placeholder="Select meeting type"
                  selectedKey={formData.location_type || undefined}
                  onSelectionChange={(key) => {
                    setFormData(prev => ({
                      ...prev,
                      location_type: key as 'in_person' | 'virtual' | 'hybrid'
                    }));
                    if (errors.location_type) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.location_type;
                        return newErrors;
                      });
                    }
                  }}
                  isRequired
                  isInvalid={!!errors.location_type}
                  errorMessage={errors.location_type}
                >
                  <SelectItem id="in_person">In Person</SelectItem>
                  <SelectItem id="virtual">Virtual (Online)</SelectItem>
                  <SelectItem id="hybrid">Hybrid (Both)</SelectItem>
                </Select>
              </div>

              {/* Location */}
              {/* <div className={styles.formGroup}> */}
                <LocationAutocomplete
                  label="Location"
                  value={formData.location || ''}
                  onChange={handleLocationChange}
                  placeholder={
                    formData.location_type === 'virtual'
                      ? 'e.g., Zoom link will be shared'
                      : 'Enter address or location'
                  }
                  className={`${styles.input} ${styles.location}`}
                />
                {errors.location && <span className={styles.error}>{errors.location}</span>}
              {/* </div> */}

              {/* Meeting Schedule */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <Select
                    name="meeting_day"
                    label="Preferred Day"
                    placeholder="Select day"
                    selectedKey={formData.meeting_day || undefined}
                    onSelectionChange={(key) => {
                      setFormData(prev => ({
                        ...prev,
                        meeting_day: key as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
                      }));
                    }}
                  >
                    <SelectItem id="monday">Monday</SelectItem>
                    <SelectItem id="tuesday">Tuesday</SelectItem>
                    <SelectItem id="wednesday">Wednesday</SelectItem>
                    <SelectItem id="thursday">Thursday</SelectItem>
                    <SelectItem id="friday">Friday</SelectItem>
                    <SelectItem id="saturday">Saturday</SelectItem>
                    <SelectItem id="sunday">Sunday</SelectItem>
                  </Select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="meeting_time" className={styles.label}>
                    Meeting Time
                  </label>
                  <input
                    type="time"
                    id="meeting_time"
                    name="meeting_time"
                    value={formData.meeting_time || ''}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Meeting Frequency */}
              <div className={styles.formGroup}>
                <Select
                  name="meeting_frequency"
                  label="Meeting Frequency"
                  placeholder="Select frequency"
                  selectedKey={formData.meeting_frequency || undefined}
                  onSelectionChange={(key) => {
                    setFormData(prev => ({
                      ...prev,
                      meeting_frequency: key as 'weekly' | 'biweekly' | 'monthly'
                    }));
                  }}
                >
                  <SelectItem id="weekly">Weekly</SelectItem>
                  <SelectItem id="biweekly">Bi-weekly</SelectItem>
                  <SelectItem id="monthly">Monthly</SelectItem>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Group Settings */}
          {currentStep === 3 && (
            <div className={styles.stepContent}>
              {/* Member Limit */}
              <div className={styles.formGroup}>
                <label htmlFor="member_limit" className={styles.label}>
                  Member Limit
                </label>
                <input
                  type="number"
                  id="member_limit"
                  name="member_limit"
                  value={formData.member_limit || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  min={2}
                  max={100}
                  placeholder="12"
                />
                <small className={styles.hint}>Maximum number of members (2-100)</small>
                {errors.member_limit && <span className={styles.error}>{errors.member_limit}</span>}
              </div>

              {/* Focus Areas */}
              <div className={styles.formGroup}>
                <label htmlFor="focus_areas" className={styles.label}>
                  Focus Areas
                </label>
                <div className={styles.tagsInput}>
                  <input
                    type="text"
                    id="focus_areas_input"
                    value={currentFocusArea}
                    onChange={(e) => setCurrentFocusArea(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFocusArea();
                      }
                    }}
                    className={styles.input}
                    placeholder="e.g., Alcohol Recovery, Young Adults, Faith-Based"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddFocusArea}
                    className={styles.addTagButton}
                  >
                    Add
                  </Button>
                </div>
                {focusAreas.length > 0 && (
                  <div className={styles.tags}>
                    {focusAreas.map((area) => (
                      <span key={area} className={styles.tag}>
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveFocusArea(area)}
                          className={styles.removeTag}
                          aria-label={`Remove ${area}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className={styles.formGroup}>
                <Select
                  name="visibility"
                  label="Group Visibility"
                  selectedKey={formData.visibility || 'public'}
                  onSelectionChange={(key) => {
                    setFormData(prev => ({
                      ...prev,
                      visibility: key as 'public' | 'community' | 'private'
                    }));
                  }}
                >
                  <SelectItem id="public">Public - Anyone can find and join</SelectItem>
                  <SelectItem id="community">Community - Members can find it</SelectItem>
                  <SelectItem id="private">Private - Invitation only</SelectItem>
                </Select>
              </div>

              {/* Open to New Members */}
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_open"
                    checked={formData.is_open || false}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  <span>Open to new members</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          {/* Step Indicators */}
          <ol className={styles.stepIndicators} aria-label="Group creation steps">
            {groupCreationSteps.map((step) => (
              <li key={`step-${step.id}`}>
                <button
                  type="button"
                  className={`${styles.stepIndicator} ${currentStep === step.id ? styles.active : ''} ${currentStep > step.id ? styles.completed : ''}`}
                  onClick={() => handleStepClick(step.id)}
                  aria-current={currentStep === step.id ? 'step' : undefined}
                  aria-label={`Go to step ${step.id}: ${step.title}`}
                >
                  <span>{currentStep > step.id ? '✓' : step.id}</span>
                </button>
              </li>
            ))}
          </ol>

          {/* Action Buttons */}
          <div className={styles.actions}>
            {currentStep > 1 && (
              <Button
                type="button"
                className={styles.secondaryButton}
                onPress={handleBack}
              >
                Back
              </Button>
            )}

            {currentStep < groupCreationSteps.length ? (
              <Button
                type="button"
                className={styles.primaryButton}
                onPress={handleNext}
              >
                <span>Next</span>
                <Icon name="ArrowRight" />
              </Button>
            ) : (
              <Button
                type="button"
                className={styles.primaryButton}
                onPress={handleSubmit}
                isDisabled={isLoading}
              >
                {isLoading
                  ? (isUpdateMode ? 'Updating...' : 'Creating...')
                  : (isUpdateMode ? 'Update Group' : 'Create Group')
                }
              </Button>
            )}
          </div>
        </nav>
      </div>
    </Modal>
  );
}
