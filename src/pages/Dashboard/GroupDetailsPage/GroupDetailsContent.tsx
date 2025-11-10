/**
 * Group Details Content Component
 * Displays all the detailed information about a group
 * Extracted from GroupDetailsPage for better code organization
 */

import { Icon, GroupMemberCard } from 'components';
import type { GroupDetailsContentProps } from 'types/pages';
import { getDisplayLocation } from './helpers';
import styles from './GroupDetailsPage.module.scss';

export function GroupDetailsContent({
  group,
  isGroupLeader,
  isActiveMember,
  hasPendingRequest
}: GroupDetailsContentProps) {
  return (
    <div className={styles.content}>
      {/* Description Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Icon name="BubbleIcon" />
          About This Group
        </h2>
        <p className={styles.description}>{group.description}</p>
      </section>

      {/* Meeting Details */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Icon name="CalendarIcon" />
          Meeting Information
        </h2>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Meeting Day</span>
            <span className={styles.detailValue}>
              <Icon name="CalendarTimeIcon" />
              {group.meeting_day ? group.meeting_day.charAt(0).toUpperCase() + group.meeting_day.slice(1) : 'Not set'}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Meeting Time</span>
            <span className={styles.detailValue}>
              <Icon name="ClockIcon" />
              {group.meeting_time}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>
              {getDisplayLocation(group.location, isGroupLeader, isActiveMember || hasPendingRequest)}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Location Type</span>
            <span className={styles.detailValue}>
              <Icon name="LocationIcon" />
              {group.location_type === 'in_person' ? 'In Person' : group.location_type === 'virtual' ? 'Virtual' : 'Hybrid'}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Frequency</span>
            <span className={styles.detailValue}>
              {group.meeting_frequency ? group.meeting_frequency.charAt(0).toUpperCase() + group.meeting_frequency.slice(1) : 'Not set'}
            </span>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      {group.focus_areas && group.focus_areas.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Icon name="HandIcon" />
            Focus Areas
          </h2>
          <div className={styles.focusAreas}>
            {group.focus_areas.map((area, index) => (
              <span key={index} className={styles.focusArea}>
                {area}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Leadership */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Icon name="PersonOutlineIcon" />
          Leadership
        </h2>
        <div className={styles.leadership}>
          <div className={styles.leader}>
            <strong>Group Leader:</strong> {group.leader_info.display_name}
          </div>
          {group.co_leaders_info && group.co_leaders_info.length > 0 && (
            <div className={styles.coLeaders}>
              <strong>Co-Leaders:</strong>
              <ul>
                {group.co_leaders_info.map((coLeader) => (
                  <li key={coLeader.id}>{coLeader.display_name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Group Members */}
      {group.group_members && group.group_members.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Icon name="PeopleIcon" />
            Group Members ({group.group_members.length})
          </h2>
          <div className={styles.membersList}>
            {group.group_members.map((member) => (
              <GroupMemberCard
                key={member.id}
                member={member}
                groupId={group.id}
                groupName={group.name}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default GroupDetailsContent;
