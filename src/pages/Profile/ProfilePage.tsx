/**
 * ProfilePage - User Profile Management
 * Displays and allows editing of user profile information with sidebar navigation
 *
 * State Management: Uses @preact/signals for reactive UI and form state
 */

import { useRef, useEffect } from 'react'
import { useSignals } from '@preact/signals-react/runtime'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from '../../contexts/Auth/useAuthContext'
import { useCurrentUser, authKeys } from '../../hooks/useAuth'
import { profilePage } from '../../signals/profile-signals'
import type { ExtendedProfile } from '../../signals/profile-signals'
import Layout from '../../components/Layout/Layout'
import Button from '../../components/Button'
import Icon from '../../components/Icon'
import Checkbox from '../../components/Checkbox'
import { toast } from '../../components/Toast'
import apiClient from '../../lib/apiClient'
import styles from './ProfilePage.module.scss'

export default function ProfilePage() {
  useSignals() // Subscribe to signal changes

  const { user, setUser } = useAuthContext()
  const { data: profileData, isLoading: isLoadingProfile } = useCurrentUser()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      // Only send fields that have been touched/changed
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

      console.log('Sending only changed fields:', updateData)

      const response = await apiClient.patch('/profiles/me/', updateData)

      // Update the user context with the saved data
      if (user && setUser) {
        setUser({
          ...user,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          username: response.data.username,
          email: response.data.email,
          display_name: response.data.display_name,
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

      const response = await apiClient.post('/profiles/me/photo/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clean up the temporary URL since we have the real one now
      URL.revokeObjectURL(tempImageUrl);

      // Update with the actual server response
      profilePage.finishPhotoUpload(response.data.photo_url, response.data.photo_thumbnail_url);

      // Update the user context with the new photo data
      if (user && setUser) {
        setUser({
          ...user,
          photo_url: response.data.photo_url,
          photo_thumbnail_url: response.data.photo_thumbnail_url,
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

  const renderProfileContent = () => {
    const activeTabValue = profilePage.activeTab.value;
    const isEditingValue = profilePage.isEditing.value.value;
    const formData = profilePage.formData.value;
    const isSavingValue = profilePage.isSaving.value.value;
    const hasChangesValue = profilePage.hasChanges.value;

    switch(activeTabValue) {
      case 'profile':
        return (
          <>
            {/* User Statistics */}
            {/* <div className={styles.profileSection}>
              <h3 className={styles.sectionTitle}>User Statistics</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{formData?.streakDays}</div>
                  <div className={styles.statLabel}>Day Streak</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{formData?.milestones}</div>
                  <div className={styles.statLabel}>Milestones</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{formData?.supportGroups}</div>
                  <div className={styles.statLabel}>Support Groups</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{formData?.followers}</div>
                  <div className={styles.statLabel}>Followers</div>
                </div>
              </div>
            </div> */}

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
                    <label htmlFor="location" className={styles.label}>Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData?.location || ''}
                      onChange={handleInputChange}
                      className={styles.input}
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
      case 'groups':
        return (
          <div className={styles.profileSection}>
            <h3 className={styles.sectionTitle}>My Group</h3>
            <p className={styles.placeholder}>Your fellowship groups will appear here. Join or create a group to get started on your recovery journey together.</p>
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
