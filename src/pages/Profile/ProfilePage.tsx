/**
 * ProfilePage - User Profile Management
 * Displays and allows editing of user profile information with sidebar navigation
 *
 * State Management: Uses @preact/signals for reactive UI and form state
 */

import { useRef, useEffect, useState } from 'react'
import { useSignals } from '@preact/signals-react/runtime'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/Auth/useAuthContext'
import { useCurrentUser, authKeys } from '../../hooks/useAuth'
import { useMyGroups } from '../../hooks/useMyGroups'
import { profilePage } from '../../signals/profile-signals'
import type { ExtendedProfile } from '../../signals/profile-signals'
import { Layout, Button, Icon, Checkbox, LocationAutocomplete, toast } from 'components'
import { StatCard, ProgressBar, CheckListItem } from '../../components/ProfileStats'
import type { PlaceData } from 'types/components/location'
import { api } from '../../services/api'
import styles from './ProfilePage.module.scss'

export default function ProfilePage() {
  useSignals()

  const navigate = useNavigate()
  const { user, setUser } = useAuthContext()
  const { data: profileData, isLoading: isLoadingProfile } = useCurrentUser()
  const { data: myGroups } = useMyGroups()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for structured location data from Google Places
  const [locationData, setLocationData] = useState<PlaceData | null>(null)

  // Cleanup function to revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any object URLs that might still be in use
      const photoUrl = profilePage.formData.value?.photoUrl
      if (photoUrl && photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl)
      }
    }
  }, [])

  // Update local state when profile data from useCurrentUser changes
  useEffect(() => {
    if (profileData) {
      profilePage.loadProfile(profileData as ExtendedProfile)
    }
  }, [profileData])

  if (!user || isLoadingProfile) {
    return (
      <Layout variant="default">
        <div className={styles.loading}>
          {!user ? 'Loading profile...' : 'Loading profile data...'}
        </div>
      </Layout>
    );
  }

  const handleEditToggle = () => {
    profilePage.isEditing.toggle()
  }

  const handleCancelEdit = () => {
    profilePage.cancelEditing()
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    profilePage.startSaving()

    try {
      const updateData: Record<string, unknown> = {}

      // Map frontend field names to backend field names
      const fieldMapping: Record<string, string> = {
        firstName: 'first_name',
        lastName: 'last_name',
        displayName: 'display_name',
        location: 'location',
        bio: 'bio',
        recoveryStage: 'recovery_stage',
        religiousContentPreference: 'religious_content_preference',
        profileVisibility: 'profile_visibility',
        showSobrietyDate: 'show_sobriety_date',
        allowDirectMessages: 'allow_direct_messages',
        emailNotifications: 'email_notifications',
        communityNotifications: 'community_notifications',
        emergencyNotifications: 'emergency_notifications',
        photoVisibility: 'photo_visibility',
      }

      const formData = profilePage.formData.value

      // Only include fields that have been touched
      const touchedFields = profilePage.touchedFields.value
      if (touchedFields) {
        touchedFields.forEach((field: string) => {
          const backendField = fieldMapping[field]
          if (backendField && formData) {
            const value = formData[field as keyof typeof formData]
            updateData[backendField] = value
          }
        })
      }

      // Add structured location data if available (for future backend support)
      if (locationData && touchedFields?.has('location')) {
        // Uncomment when backend supports these fields:
        // updateData.location_city = locationData.city
        // updateData.location_state = locationData.state
        // updateData.location_country = locationData.country
        // updateData.latitude = locationData.latitude
        // updateData.longitude = locationData.longitude
      }

      const response = await api.patch<{
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        display_name: string;
      }>('/profiles/me/', updateData)

      // Update the user context with the saved data
      if (user && setUser) {
        setUser({
          ...user,
          first_name: response.first_name,
          last_name: response.last_name,
          username: response.username,
          email: response.email,
          display_name: response.display_name,
        })
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })

      // Update original profile and reset state
      profilePage.finishSaving()
      toast.success('Profile updated successfully!')
    } catch (error: unknown) {
      console.error('Error saving profile:', error)
      let errorMessage = 'Failed to update profile. Please try again.'
      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { data?: { message?: string } } }
        errorMessage = responseError.response?.data?.message || errorMessage
      }
      profilePage.savingError()
      toast.error(errorMessage)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    profilePage.updateField(name as keyof typeof profilePage.formData.value, finalValue)
  }

  // Handle location autocomplete changes
  const handleLocationChange = (location: string, placeData?: PlaceData) => {
    profilePage.updateField('location', location)
    if (placeData) {
      setLocationData(placeData)
    }
  }

  const validateImageFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const maxFileSize = 1.5 * 1024 * 1024; // 1.5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, or WebP).';
    }

    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return 'Please select a file with a valid extension (.jpg, .jpeg, .png, .webp).';
    }

    if (file.size > maxFileSize) {
      return 'File size must be less than 1.5MB.';
    }

    return null;
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    profilePage.uploadError.value = null;

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      profilePage.photoUploadError(validationError);
      return;
    }

    // Optimistic update: Show image immediately
    const tempImageUrl = URL.createObjectURL(file);
    const previousPhoto = profilePage.formData.value?.photoUrl;

    profilePage.updateField('photoUrl', tempImageUrl);

    profilePage.startPhotoUpload();

    try {
      const formData = new FormData();
      formData.append('photo', file);
      const csrfToken = await api.getCsrfToken();
      const accessToken = api.getAccessToken();

      // Build headers
      const headers: Record<string, string> = {
        'X-CSRFToken': csrfToken,
      };

      // Add Authorization header if access token exists
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      // For file upload, use direct fetch since api.post JSON.stringifies body
      const { API_BASE_URL } = await import('../../configs/api-configs');
      const uploadResponse = await fetch(`${API_BASE_URL}/profiles/me/photo/upload/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload photo');
      }

      const response = await uploadResponse.json();

      // Clean up the temporary URL since we have the real one now
      URL.revokeObjectURL(tempImageUrl);

      profilePage.finishPhotoUpload(response.photo_url, response.photo_thumbnail_url);

      // Update the user context with the new photo data
      if (user && setUser) {
        setUser({
          ...user,
          photo_url: response.photo_url,
          photo_thumbnail_url: response.photo_thumbnail_url,
        });
      }

      // Invalidate and refetch the current user query to update everywhere
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: unknown) {
      console.error('Failed to upload profile photo:', error);

      // Revert to previous photo on error
      URL.revokeObjectURL(tempImageUrl);
      profilePage.updateField('photoUrl', previousPhoto);

      profilePage.photoUploadError('Failed to upload photo. Please try again.');
    }
  };

  const handleAvatarClick = () => {
    if (profilePage.formData.value?.canUploadPhoto) {
      fileInputRef.current?.click();
    }
  };

  const getFullName = (first: string = '', last: string = '') => {
    if (!first && !last) {
      return 'Not Specified'
    }
    return `${first} ${last}`
  }

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    const formData = profilePage.formData.value;
    const checks = [
      { key: 'account', complete: true, label: 'Account created' },
      {
        key: 'location',
        complete: !!formData?.location && formData.location.trim() !== '',
        label: 'Location set',
        action: 'Set Location',
        onAction: () => profilePage.isEditing.value.value = true
      },
      {
        key: 'bio',
        complete: !!formData?.bio && formData.bio.trim() !== '',
        label: 'Bio added',
        action: 'Add Bio',
        onAction: () => profilePage.isEditing.value.value = true
      },
      {
        key: 'photo',
        complete: !!formData?.photoUrl,
        label: 'Profile photo uploaded',
        action: 'Upload Photo',
        onAction: () => fileInputRef.current?.click()
      },
      {
        key: 'group',
        complete: (myGroups?.length || 0) > 0,
        label: 'Joined a fellowship group',
        action: 'Browse Groups',
        onAction: () => navigate('/groups')
      },
    ];

    const completeCount = checks.filter(c => c.complete).length;
    const percentage = Math.round((completeCount / checks.length) * 100);

    return { checks, percentage, completeCount, totalCount: checks.length };
  };

  // Format date for member since
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const renderProfileContent = () => {
    const activeTabValue = profilePage.activeTab.value;
    const isEditingValue = profilePage.isEditing.value.value;
    const formData = profilePage.formData.value;
    const isSavingValue = profilePage.isSaving.value.value;
    const hasChangesValue = profilePage.hasChanges.value;

    // Get fellowship data
    const profileCompletion = calculateProfileCompletion();
    const activeGroupsCount = myGroups?.length || 0;
    const memberSince = formatMemberSince(user?.date_joined);

    switch(activeTabValue) {
      case 'profile':
        return (
          <>
            {/* Personal Information */}
            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                <Button
                  variant="secondary"
                  onPress={handleEditToggle}
                >
                  {isEditingValue ? (
                    <>
                      <Icon name="CrossIcon" width={16} height={16} />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Icon name="PencilIcon" width={16} height={16} />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              {isEditingValue ? (
                <form className={styles.profileForm} onSubmit={handleSaveProfile}>

                  <div className={styles.formGroupFull} style={{ marginBlockEnd: 'var(--size-2)'}}>
                    <label htmlFor="bio" className={styles.label}>Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData?.bio || ''}
                      onChange={handleInputChange}
                      className={styles.textarea}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData?.firstName || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData?.lastName || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <LocationAutocomplete
                      label="Location"
                      value={formData?.location || ''}
                      onChange={handleLocationChange}
                      placeholder="Enter your city or location"
                      className={styles.locationInput}
                    />
                  </div>



                  <div className={styles.formGroup}>
                    <label htmlFor="displayName" className={styles.label}>Display Name</label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData?.displayName || ''}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="How you want to be known to others"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="profileVisibility" className={styles.label}>Profile Visibility</label>
                    <select
                      id="profileVisibility"
                      name="profileVisibility"
                      value={formData?.profileVisibility || ''}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="public">Public - Visible to everyone</option>
                      <option value="community">Community - Visible to community members</option>
                      <option value="private">Private - Visible to only your Group</option>
                    </select>
                  </div>

                  <div className={styles.formActions}>
                    <Button
                      variant="secondary"
                      onPress={handleCancelEdit}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" isDisabled={isSavingValue || !hasChangesValue}>
                      <Icon name="CheckMarkIcon" width={16} height={16} />
                      {isSavingValue ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className={styles.formGroup} style={{ marginBottom: 'var(--size-6)' }}>
                    <h5 className={styles.display_label}>Bio</h5>
                    <span className={styles.display_value}>{formData?.bio || 'No bio provided'}</span>
                  </div>
                  <div className={styles.profileView}>
                    <div className={styles.formGroup}>
                      <div className={styles.display_label}>Full Name</div>
                      <div className={styles.display_value}>
                        {getFullName(formData?.firstName, formData?.lastName)}
                      </div>
                    </div>

                    {formData?.displayName && (
                      <div className={styles.formGroup}>
                        <h5 className={styles.display_label}>Display Name</h5>
                        <span className={styles.display_value}>@{user.display_name_or_email || ''}</span>
                      </div>
                    )}

                    <div className={styles.formGroup}>
                      <h5 className={styles.display_label}>Location</h5>
                      <span className={styles.display_value}>{formData?.location || 'Not specified'}</span>
                    </div>

                    <div className={styles.formGroup}>
                      <div className={styles.display_label}>Profile Visibility</div>
                      <div className={styles.display_value}>
                        {formData?.profileVisibility.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        );
      case 'completion':
        return (
          <div className={styles.profileSection}>
            <h3 className={styles.sectionTitle}>Complete Your Profile</h3>
            {profileCompletion.percentage === 100 ? (
              <div className={styles.completionContainer}>
                <ProgressBar
                  percentage={100}
                  variant="accent"
                />
                <p className={styles.completionText}>
                  🎉 Your profile is complete! Great job.
                </p>
              </div>
            ) : (
              <div className={styles.completionContainer}>
                <ProgressBar
                  percentage={profileCompletion.percentage}
                  variant="accent"
                />
                <p className={styles.completionText}>
                  {profileCompletion.completeCount} of {profileCompletion.totalCount} steps complete
                </p>
                <div className={styles.checkList}>
                  {profileCompletion.checks.map((check) => (
                    <CheckListItem
                      key={check.key}
                      complete={check.complete}
                      label={check.label}
                      action={check.action}
                      onAction={check.onAction}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'my-groups':
        return (
          <>
            {/* My Fellowship Journey Stats */}
            <div className={`${styles.profileSection} ${styles.column}`}>
              <h3 className={styles.sectionTitle}>My Fellowship Journey</h3>
              <div className={styles.statsGrid}>
                <StatCard
                  icon="PersonIcon"
                  value={memberSince}
                  label="Member Since"
                />
                <StatCard
                  icon="PeopleIcon"
                  value={activeGroupsCount.toString()}
                  label={activeGroupsCount === 1 ? 'Active Group' : 'Active Groups'}
                  variant={activeGroupsCount > 0 ? 'accent' : 'default'}
                />
              </div>
            </div>

            {/* My Groups List */}
            {activeGroupsCount > 0 ? (
              <div className={`${styles.profileSection} ${styles.mt}`}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>My Groups</h3>
                  <Button
                    variant="tertiary"
                    onPress={() => navigate('/groups')}
                  >
                    <Icon name="PlusIcon" width={16} height={16} />
                    Join Another Group
                  </Button>
                </div>
                <div className={styles.groupsList}>
                  {myGroups?.map((group) => (
                    <div
                      key={group.id}
                      className={styles.groupCard}
                      onClick={() => navigate(`/groups/${group.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/groups/${group.id}`);
                        }
                      }}
                    >
                      <div className={styles.groupIcon}>
                        <Icon name="PeopleIcon" width={24} height={24} />
                      </div>
                      <div className={styles.groupInfo}>
                        <h4 className={styles.groupName}>{group.name}</h4>
                        <div className={styles.groupMeta}>
                          <span className={styles.groupRole}>
                            {group.membership_status === 'leader' || group.membership_status === 'co_leader'
                              ? 'Leader'
                              : 'Member'}
                          </span>
                          <span className={styles.groupMembers}>
                            {group.current_member_count} {group.current_member_count === 1 ? 'member' : 'members'}
                          </span>
                        </div>
                      </div>
                      <Icon name="ArrowRight" width={20} height={20} className={styles.groupArrow} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.profileSection}>
                <div className={styles.emptyState}>
                  <Icon name="PeopleIcon" width={48} height={48} />
                  <h4>No Groups Yet</h4>
                  <p>Join your first fellowship group to connect with your community and start your journey together.</p>
                  <Button
                    variant="primary"
                    onPress={() => navigate('/groups')}
                  >
                    <Icon name="PlusIcon" width={16} height={16} />
                    Browse Groups
                  </Button>
                </div>
              </div>
            )}
          </>
        );
      case 'community':
        return (
          <div className={styles.profileSection}>
            <h3 className={styles.sectionTitle}>Community Connections</h3>
            <div className={styles.emptyState}>
              <Icon name="PeopleIcon" width={48} height={48} />
              <h4>Coming Soon</h4>
              <p>Community connection features will be available here soon. Stay tuned!</p>
            </div>
          </div>
        );
      case 'groups':
        return (
          <div className={styles.profileSection}>
            <h3 className={styles.sectionTitle}>My Fellowship Group</h3>
            <p className={styles.text}>Detailed group information and interactions will appear here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Account Settings</h3>
              <Button
                variant="secondary"
                onPress={handleEditToggle}
              >
                {isEditingValue ? (
                  <>
                    <Icon name="CrossIcon" width={16} height={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Icon name="PencilIcon" width={16} height={16} />
                    Edit Settings
                  </>
                )}
              </Button>
            </div>

            {isEditingValue ? (
              <form className={styles.profileForm} onSubmit={handleSaveProfile}>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Notification Preferences</label>
                  <div className={styles.checkboxGroup}>
                    <Checkbox
                      isSelected={formData?.emailNotifications || false}
                      onChange={(isSelected) => {
                        profilePage.updateField('emailNotifications', isSelected);
                      }}
                    >
                      Email notifications
                    </Checkbox>
                    <Checkbox
                      isSelected={formData?.communityNotifications || false}
                      onChange={(isSelected) => {
                        profilePage.updateField('communityNotifications', isSelected);
                      }}
                    >
                      Community notifications
                    </Checkbox>
                    <Checkbox
                      isSelected={formData?.emergencyNotifications || false}
                      onChange={(isSelected) => {
                        profilePage.updateField('emergencyNotifications', isSelected);
                      }}
                    >
                      Emergency notifications
                    </Checkbox>
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Privacy Settings</label>
                  <div className={styles.checkboxGroup}>
                    <Checkbox
                      isSelected={formData?.allowDirectMessages || false}
                      onChange={(isSelected) => {
                        profilePage.updateField('allowDirectMessages', isSelected);
                      }}
                    >
                      Allow direct messages from other users
                    </Checkbox>
                    <Checkbox
                      isSelected={formData?.showSobrietyDate || false}
                      onChange={(isSelected) => {
                        profilePage.updateField('showSobrietyDate', isSelected);
                      }}
                    >
                      Show sobriety date publicly
                    </Checkbox>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="photoVisibility" className={styles.label}>Photo Visibility</label>
                  <select
                    id="photoVisibility"
                    name="photoVisibility"
                    value={formData?.photoVisibility || ''}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="public">Public - Visible to everyone</option>
                    <option value="community">Community - Visible to community members</option>
                    <option value="private">Private - Visible to connections only</option>
                  </select>
                </div>

                <div className={styles.formActions}>
                  <Button
                    variant="secondary"
                    onPress={handleCancelEdit}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isDisabled={isSavingValue || !hasChangesValue}>
                    <Icon name="CheckMarkIcon" width={16} height={16} />
                    {isSavingValue ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className={styles.profileView}>
                <div className={styles.formGroup}>
                  <div className={styles.label}>Notification Preferences</div>
                  <div className={styles.value}>
                    <div className={styles.settingsList}>
                      <div>Email: {formData?.emailNotifications ? '✓ Enabled' : '✗ Disabled'}</div>
                      <div>Community: {formData?.communityNotifications ? '✓ Enabled' : '✗ Disabled'}</div>
                      <div>Emergency: {formData?.emergencyNotifications ? '✓ Enabled' : '✗ Disabled'}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.label}>Privacy Settings</div>
                  <div className={styles.value}>
                    <div className={styles.settingsList}>
                      <div>Direct Messages: {formData?.allowDirectMessages ? '✓ Allowed' : '✗ Disabled'}</div>
                      <div>Sobriety Date: {formData?.showSobrietyDate ? '✓ Public' : '✗ Private'}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.label}>Photo Visibility</div>
                  <div className={styles.value}>
                    {formData?.photoVisibility.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Get current form data for rendering
  const formData = profilePage.formData.value;

  return (
    <Layout variant="default">
      <div className={styles.profileContainer}>
        <h1 className={styles.profileTitle}>My Profile</h1>

        <div className={styles.profileGrid}>
          {/* Sidebar */}
          <div className={styles.profileSidebar}>
            <div
              className={`${styles.profileAvatar} ${!formData?.canUploadPhoto ? styles.uploadDisabled : ''}`}
              onClick={handleAvatarClick}
            >
              {formData?.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Profile"
                  className={styles.avatarImage}
                />
              ) : (
                (formData?.firstName?.charAt(0) || '') + (formData?.lastName?.charAt(0) || '')
              )}
              {formData?.canUploadPhoto && (
                <div className={`${styles.avatarOverlay} ${profilePage.isUploadingPhoto.value.value ? styles.uploading : ''}`}>
                  <Icon name="PencilIcon" width={24} height={24} />
                  {profilePage.isUploadingPhoto.value.value && (
                    <div className={styles.uploadingIndicator}>Uploading...</div>
                  )}
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              aria-label="Upload profile photo"
            />

            {/* Upload error message */}
            {profilePage.uploadError.value && (
              <div className={styles.uploadError}>
                {profilePage.uploadError.value}
              </div>
            )}

            <h2 className={styles.profileName}>
              {`${formData?.firstName || ''} ${formData?.lastName || ''}`.trim() || formData?.displayName || formData?.username}
            </h2>
            <p className={styles.profileUsername}>
              @{formData?.displayName || formData?.username || user.display_name_or_email}
            </p>

            <ul className={styles.profileNavList}>
              <li className={profilePage.activeTab.value === 'profile' ? styles.profileNavItemActive : styles.profileNavItem}>
                <button onClick={() => profilePage.activeTab.value = 'profile'}>
                  <Icon name="PersonOutlineIcon" width={18} height={18} />
                  <span>My Profile</span>
                </button>
              </li>
              <li className={profilePage.activeTab.value === 'completion' ? styles.profileNavItemActive : styles.profileNavItem}>
                <button onClick={() => profilePage.activeTab.value = 'completion'}>
                  <Icon name="CheckMarkIcon" width={18} height={18} />
                  <span>Profile Checklist</span>
                </button>
              </li>
              <li className={profilePage.activeTab.value === 'my-groups' ? styles.profileNavItemActive : styles.profileNavItem}>
                <button onClick={() => profilePage.activeTab.value = 'my-groups'}>
                  <Icon name="PeopleIcon" width={18} height={18} />
                  <span>My Groups Overview</span>
                </button>
              </li>
              <li className={profilePage.activeTab.value === 'community' ? styles.profileNavItemActive : styles.profileNavItem}>
                <button onClick={() => profilePage.activeTab.value = 'community'}>
                  <Icon name="PeopleIcon" width={18} height={18} />
                  <span>Community Connections</span>
                </button>
              </li>
              <li className={profilePage.activeTab.value === 'groups' ? styles.profileNavItemActive : styles.profileNavItem}>
                <button onClick={() => profilePage.activeTab.value = 'groups'}>
                  <Icon name="PeopleIcon" width={18} height={18} />
                  <span>My Fellowship Group</span>
                </button>
              </li>
              <li className={profilePage.activeTab.value === 'settings' ? styles.profileNavItemActive : styles.profileNavItem}>
                <button onClick={() => profilePage.activeTab.value = 'settings'}>
                  <Icon name="SettingsIcon" width={18} height={18} />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className={styles.profileContent}>
            {renderProfileContent()}
          </div>
        </div>
      </div>
    </Layout>
  );

};
