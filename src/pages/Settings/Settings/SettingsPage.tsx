/**
 * SettingsPage - Application Settings
 * Allows users to configure app preferences, privacy, and security settings
 */

import { useSignals } from '@preact/signals-react/runtime';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/Auth/useAuthContext';
import { settingsPage } from '../../../signals/page-signals';
import Layout from '../../../components/Layout/Layout';
import Icon from '../../../components/Icon';
import styles from './SettingsPage.module.scss';

export default function SettingsPage() {
  useSignals();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    settingsPage.showDeleteConfirm.setFalse();
  };

  // Get signal values for rendering
  const activeTab = settingsPage.activeTab.value;
  const showDeleteConfirm = settingsPage.showDeleteConfirm.value.value;

  if (!user) {
    return (
      <Layout variant="default">
        <div className={styles.loading}>Loading settings...</div>
      </Layout>
    );
  }

  const renderSettingsContent = () => {
    switch(activeTab) {
      case 'account':
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Account Settings</h3>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Email Address</div>
                <div className={styles.settingValue}>{user.email}</div>
              </div>
              <button className={styles.settingAction} aria-label="Change email">
                Change
              </button>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Password</div>
                <div className={styles.settingValue}>••••••••</div>
              </div>
              <button className={styles.settingAction} aria-label="Change password">
                Change
              </button>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Two-Factor Authentication</div>
                <div className={styles.settingDescription}>
                  Add an extra layer of security to your account
                </div>
              </div>
              <button className={styles.settingAction} aria-label="Enable 2FA">
                Enable
              </button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Privacy Settings</h3>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Profile Visibility</div>
                <div className={styles.settingDescription}>
                  Control who can see your profile
                </div>
              </div>
              <select className={styles.select} defaultValue="private">
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Data Sharing</div>
                <div className={styles.settingDescription}>
                  Allow anonymous usage data to improve the app
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked={false} />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Analytics</div>
                <div className={styles.settingDescription}>
                  Help us improve by sharing analytics data
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked={false} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Notification Preferences</h3>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Email Notifications</div>
                <div className={styles.settingDescription}>
                  Receive updates and reminders via email
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked={true} />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Push Notifications</div>
                <div className={styles.settingDescription}>
                  Get notified about important updates
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked={true} />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Daily Reminders</div>
                <div className={styles.settingDescription}>
                  Receive daily check-in reminders
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked={true} />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Milestone Celebrations</div>
                <div className={styles.settingDescription}>
                  Get notified when you reach recovery milestones
                </div>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked={true} />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Appearance</h3>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Theme</div>
                <div className={styles.settingDescription}>
                  Choose your preferred color theme
                </div>
              </div>
              <select className={styles.select} defaultValue="light">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Font Size</div>
                <div className={styles.settingDescription}>
                  Adjust text size for better readability
                </div>
              </div>
              <select className={styles.select} defaultValue="medium">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        );

      case 'danger':
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Account Management</h3>

            <div className={styles.dangerZone}>
              <div className={styles.dangerItem}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>Log Out</div>
                  <div className={styles.settingDescription}>
                    Sign out of your account on this device
                  </div>
                </div>
                <button
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>

              <div className={styles.dangerItem}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>Delete Account</div>
                  <div className={styles.settingDescription}>
                    Permanently delete your account and all data
                  </div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => settingsPage.showDeleteConfirm.setTrue()}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout variant="default">
      <div className={styles.settingsContainer}>
        <h1 className={styles.settingsTitle}>Settings</h1>

        <div className={styles.settingsGrid}>
          {/* Sidebar */}
          <div className={styles.settingsSidebar}>
            <ul className={styles.settingsNavList}>
              <li className={activeTab === 'account' ? styles.settingsNavItemActive : styles.settingsNavItem}>
                <button onClick={() => settingsPage.setActiveTab('account')}>
                  <Icon name="PersonOutlineIcon" width={18} height={18} />
                  <span>Account</span>
                </button>
              </li>
              <li className={activeTab === 'privacy' ? styles.settingsNavItemActive : styles.settingsNavItem}>
                <button onClick={() => settingsPage.setActiveTab('privacy')}>
                  <Icon name="LockedIcon" width={18} height={18} />
                  <span>Privacy</span>
                </button>
              </li>
              <li className={activeTab === 'notifications' ? styles.settingsNavItemActive : styles.settingsNavItem}>
                <button onClick={() => settingsPage.setActiveTab('notifications')}>
                  <Icon name="NotificationIcon" width={18} height={18} />
                  <span>Notifications</span>
                </button>
              </li>
              <li className={activeTab === 'appearance' ? styles.settingsNavItemActive : styles.settingsNavItem}>
                <button onClick={() => settingsPage.setActiveTab('appearance')}>
                  <Icon name="EyeIcon" width={18} height={18} />
                  <span>Appearance</span>
                </button>
              </li>
              <li className={activeTab === 'danger' ? styles.settingsNavItemActive : styles.settingsNavItem}>
                <button onClick={() => settingsPage.setActiveTab('danger')}>
                  <Icon name="ExclamationTriangleIcon" width={18} height={18} />
                  <span>Account Management</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className={styles.settingsContent}>
            {renderSettingsContent()}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className={styles.modal} onClick={() => settingsPage.showDeleteConfirm.setFalse()}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Delete Account</h3>
              <p className={styles.modalText}>
                Are you sure you want to delete your account? This action cannot be undone.
                All your data will be permanently deleted.
              </p>
              <div className={styles.modalActions}>
                <button
                  className={styles.modalCancel}
                  onClick={() => settingsPage.showDeleteConfirm.setFalse()}
                >
                  Cancel
                </button>
                <button
                  className={styles.modalConfirm}
                  onClick={handleDeleteAccount}
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
