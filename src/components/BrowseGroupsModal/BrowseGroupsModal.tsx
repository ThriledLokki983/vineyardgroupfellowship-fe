/**
 * Browse Groups Modal
 * Modal for browsing and searching available fellowship groups
 */

import { useState, useMemo } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { listGroups } from '../../services/groupApi';
import { getGroupDetailsPath } from '../../configs/paths';
import Modal from '../Modal';
import Icon from '../Icon';
import { Button, InlineLoader, FilterButtonGroup } from 'components';
import type { FilterOption } from 'components';
import type { GroupListItem } from '../../types/group';
import type { BrowseGroupsModalProps, GroupCardProps } from 'types';
import styles from './BrowseGroupsModal.module.scss';

type LocationTypeFilter = 'all' | 'in_person' | 'virtual' | 'hybrid';

const locationTypeOptions: FilterOption<LocationTypeFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'in_person', label: 'In-Person', icon: <Icon name="LocationIcon" size={16} /> },
  { value: 'virtual', label: 'Virtual', icon: <Icon name="PhoneIcon" size={16} /> },
  { value: 'hybrid', label: 'Hybrid', icon: <Icon name="MeetingIcon" size={16} /> },
];

export default function BrowseGroupsModal({ isOpen, onClose }: BrowseGroupsModalProps) {
  useSignals();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState<LocationTypeFilter>('all');
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  // Fetch groups
  const { data: groups, isLoading, error } = useQuery<GroupListItem[]>({
    queryKey: ['groups', 'browse'],
    queryFn: async () => {
      const result = await listGroups();
      // Ensure we always return an array
      return Array.isArray(result) ? result : [];
    },
    enabled: isOpen,
  });

  // Filter groups based on search and filters
  const filteredGroups = useMemo(() => {
    // Ensure groups is always an array
    const groupsArray = Array.isArray(groups) ? groups : [];

    let result = groupsArray;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(group =>
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.location.toLowerCase().includes(query)
      );
    }

    // Apply location type filter
    if (locationTypeFilter !== 'all') {
      result = result.filter(group => group.location_type === locationTypeFilter);
    }

    // Apply open/closed filter
    if (showOpenOnly) {
      result = result.filter(group => group.is_open);
    }

    // Apply availability filter
    if (showAvailableOnly) {
      result = result.filter(group => group.available_spots > 0);
    }

    return result;
  }, [groups, searchQuery, locationTypeFilter, showOpenOnly, showAvailableOnly]);

  const handleGroupClick = (groupId: string) => {
    navigate(getGroupDetailsPath(groupId));
    onClose();
  };

  const handleReset = () => {
    setSearchQuery('');
    setLocationTypeFilter('all');
    setShowOpenOnly(true);
    setShowAvailableOnly(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Browse Groups"
      className={styles.browseGroupsModal}
    >
      <div className={styles.container}>
        {/* Search and Filters Section */}
        <div className={styles.filtersSection}>
          <div className={styles.searchWrapper}>
            <Icon name="SearchIcon" />
            <input
              type="text"
              placeholder="Search by name, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <Icon name="CrossIcon" />
              </button>
            )}
          </div>

          <div className={styles.filters}>
            {/* Location Type Filter */}
            <FilterButtonGroup
              label="Location Type:"
              options={locationTypeOptions}
              value={locationTypeFilter}
              onChange={setLocationTypeFilter}
            />

            {/* Toggle Filters */}
            <div className={styles.toggleFilters}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={showOpenOnly}
                  onChange={(e) => setShowOpenOnly(e.target.checked)}
                />
                <span>Open groups only</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                />
                <span>Available spots only</span>
              </label>
            </div>

            <button className={styles.resetButton} onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h3 className={styles.resultsCount}>
              {isLoading ? (
                <InlineLoader isFetching={true} />
              ) : (
                <>
                  {filteredGroups.length} {filteredGroups.length === 1 ? 'group' : 'groups'} found
                </>
              )}
            </h3>
          </div>

          <div className={styles.groupsList}>
            {isLoading && (
              <div className={styles.loadingState}>
                <InlineLoader isFetching={true} />
                <p>Loading groups...</p>
              </div>
            )}

            {error && (
              <div className={styles.errorState}>
                <Icon name="CrossIcon" />
                <p>Failed to load groups. Please try again.</p>
              </div>
            )}

            {!isLoading && !error && filteredGroups.length === 0 && (
              <div className={styles.emptyState}>
                <Icon name="EmptyGroupIcon" />
                <p>No groups found matching your criteria.</p>
                <button className={styles.resetButton} onClick={handleReset}>
                  Clear Filters
                </button>
              </div>
            )}

            {!isLoading && !error && filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => handleGroupClick(group.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <Button variant="secondary" onPress={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Group Card Component
const GroupCard = ({ group, onClick }: GroupCardProps) => {
  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'in_person': return 'In-Person';
      case 'virtual': return 'Virtual';
      case 'hybrid': return 'Hybrid';
      default: return type;
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'in_person': return 'LocationIcon';
      case 'virtual': return 'PhoneIcon';
      case 'hybrid': return 'MeetingIcon';
      default: return 'LocationIcon';
    }
  };

  const spotsRemaining = group.available_spots;
  const isFull = spotsRemaining === 0;
  const isAlmostFull = spotsRemaining <= 2 && spotsRemaining > 0;

  return (
    <button className={styles.groupCard} onClick={onClick}>
      <div className={styles.groupCardHeader}>
        <h4 className={styles.groupName}>{group.name}</h4>
        <div className={styles.badges}>
          {!group.is_open && (
            <span className={`${styles.badge} ${styles.closedBadge}`}>Closed</span>
          )}
          {isFull && (
            <span className={`${styles.badge} ${styles.fullBadge}`}>Full</span>
          )}
          {isAlmostFull && (
            <span className={`${styles.badge} ${styles.almostFullBadge}`}>
              {spotsRemaining} spot{spotsRemaining !== 1 ? 's' : ''} left
            </span>
          )}
        </div>
      </div>

      <p className={styles.groupDescription}>
        {group.description.length > 120
          ? `${group.description.substring(0, 120)}...`
          : group.description
        }
      </p>

      <div className={styles.groupMeta}>
        <div className={styles.metaItem}>
          <Icon name={getLocationIcon(group.location_type)} />
          <span>{getLocationTypeLabel(group.location_type)}</span>
        </div>
        <div className={styles.metaItem}>
          <Icon name="LocationIcon" />
          <span>{group.location}</span>
        </div>
        <div className={styles.metaItem}>
          <Icon name="ClockIcon" />
          <span>{group.meeting_time}</span>
        </div>
        <div className={styles.metaItem}>
          <Icon name="PersonOutlineIcon" />
          <span>
            {group.current_member_count}/{group.member_limit} members
          </span>
        </div>
      </div>

      <div className={styles.groupCardFooter}>
        <span className={styles.viewDetails}>
          View Details <Icon name="ArrowRight" />
        </span>
      </div>
    </button>
  );
};
