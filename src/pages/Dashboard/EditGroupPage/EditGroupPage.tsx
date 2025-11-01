/**
 * Edit Group Page
 * Allows group leaders to edit their group details
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getGroup, updateGroup } from '../../../services/groupApi';
import { Layout, LoadingState, Icon, Button, Select, SelectItem } from 'components';
import { toast } from '../../../components/Toast';
import { useAuthContext } from '../../../contexts/Auth/useAuthContext';
import type { Group } from '../../../types/group';
import styles from './EditGroupPage.module.scss';

export const EditGroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    location_type: 'in_person' as 'in_person' | 'virtual' | 'hybrid',
    member_limit: 12,
    is_open: true,
    meeting_day: 'monday' as Group['meeting_day'],
    meeting_time: '',
    meeting_frequency: 'weekly' as 'weekly' | 'biweekly' | 'monthly',
    focus_areas: [] as string[],
    visibility: 'community' as 'public' | 'community' | 'private',
  });

  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroup(id!),
    enabled: !!id,
  });

  // Check if current user is the group leader
  const isGroupLeader = Boolean(
    user &&
    group &&
    group.user_membership &&
    group.user_membership.role === 'leader'
  );

  // Populate form data when group is loaded
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        location: group.location,
        location_type: group.location_type,
        member_limit: group.member_limit,
        is_open: group.is_open,
        meeting_day: group.meeting_day,
        meeting_time: group.meeting_time,
        meeting_frequency: group.meeting_frequency,
        focus_areas: group.focus_areas,
        visibility: group.visibility,
      });
    }
  }, [group]);

  const updateGroupMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return updateGroup(id!, data);
    },
    onSuccess: () => {
      // Invalidate and refetch the group data
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });

      // Show success message
      toast.success('Group updated successfully!');

      // Navigate back to group details page
      navigate(`/dashboard/groups/${id}`);
    },
    onError: (error: Error) => {
      // Show error message
      toast.error(error.message || 'Failed to update group. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGroupMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate(`/dashboard/groups/${id}`);
  };

  if (isLoading) {
    return (
      <Layout variant="default">
        <LoadingState message="Loading group..." />
      </Layout>
    );
  }

  if (error || !group) {
    return (
      <Layout variant="default">
        <div className={styles.error}>
          <Icon name="ExclamationCircleIcon" />
          <h2>Group Not Found</h2>
          <p>The group you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  if (!isGroupLeader) {
    return (
      <Layout variant="default">
        <div className={styles.error}>
          <Icon name="LockedIcon" />
          <h2>Access Denied</h2>
          <p>Only group leaders can edit group details.</p>
          <Button variant="primary" onPress={handleCancel}>
            Back to Group
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout variant="default">
      <div className={styles.editGroupPage}>
        <header className={styles.header}>
          <Button
            variant="tertiary"
            onPress={handleCancel}
            className={styles.backButton}
          >
            <Icon name="ArrowLeftIcon" width={20} height={20} />
            Back to Group
          </Button>
          <h1 className={styles.title}>Edit Group</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Group Name <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={styles.textarea}
                rows={4}
              />
            </div>
          </section>

          {/* Meeting Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Meeting Information</h2>

            {/* Location Type + Location */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <Select
                  label="Location Type"
                  selectedKey={formData.location_type}
                  onSelectionChange={(key) => setFormData({ ...formData, location_type: key as 'in_person' | 'virtual' | 'hybrid' })}
                >
                  <SelectItem id="in_person">In Person</SelectItem>
                  <SelectItem id="virtual">Virtual</SelectItem>
                  <SelectItem id="hybrid">Hybrid</SelectItem>
                </Select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Meeting Day + Meeting Time */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <Select
                  label="Meeting Day"
                  selectedKey={formData.meeting_day}
                  onSelectionChange={(key) => setFormData({ ...formData, meeting_day: key as Group['meeting_day'] })}
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
                  id="meeting_time"
                  type="time"
                  value={formData.meeting_time}
                  onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Frequency */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <Select
                  label="Frequency"
                  selectedKey={formData.meeting_frequency}
                  onSelectionChange={(key) => setFormData({ ...formData, meeting_frequency: key as 'weekly' | 'biweekly' | 'monthly' })}
                >
                  <SelectItem id="weekly">Weekly</SelectItem>
                  <SelectItem id="biweekly">Bi-weekly</SelectItem>
                  <SelectItem id="monthly">Monthly</SelectItem>
                </Select>
              </div>
            </div>
          </section>

          {/* Group Settings */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Group Settings</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="member_limit" className={styles.label}>
                  Member Limit
                </label>
                <input
                  id="member_limit"
                  type="number"
                  min="2"
                  max="50"
                  value={formData.member_limit}
                  onChange={(e) => setFormData({ ...formData, member_limit: parseInt(e.target.value) })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <Select
                  label="Visibility"
                  selectedKey={formData.visibility}
                  onSelectionChange={(key) => setFormData({ ...formData, visibility: key as 'public' | 'community' | 'private' })}
                >
                  <SelectItem id="public">Public</SelectItem>
                  <SelectItem id="community">Community</SelectItem>
                  <SelectItem id="private">Private</SelectItem>
                </Select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.is_open}
                  onChange={(e) => setFormData({ ...formData, is_open: e.target.checked })}
                  className={styles.checkbox}
                />
                <span>Open for new members</span>
              </label>
            </div>
          </section>

          {/* Form Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onPress={handleCancel}
              className={styles.actionButton}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className={styles.actionButton}
              isDisabled={updateGroupMutation.isPending}
            >
              {updateGroupMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditGroupPage;
