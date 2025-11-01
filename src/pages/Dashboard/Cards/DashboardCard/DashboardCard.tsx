import type { ReactNode } from 'react';
import { Icon, InlineLoader, Button } from 'components';
import { GroupSummaryCard } from '../GroupSummaryCard';

type EMPTY_ICON_MAP = 'EmptyMailboxIcon' | 'EmptyWritingIcon' | 'EmptyGroupIcon' | 'SearchIcon';
type TITLE_ICON_MAP = 'OutboxIcon' | 'InboxIcon' | 'PeopleIcon' | 'ClockIcon' | 'SearchIcon' | 'DashboardIcon' | 'StatsIcon';

interface GroupData {
	id: string;
	name: string;
	description: string;
	location: string;
	location_type: 'in_person' | 'virtual' | 'hybrid';
	meeting_time: string;
	is_open: boolean;
	current_member_count: number;
	member_limit: number;
	available_spots: number;
	photo_url: string | null;
	my_role: 'leader' | 'co_leader' | 'member';
	created_by_me: boolean;
	joined_at: string;
	membership_status: 'pending' | 'active' | 'inactive' | 'removed' | 'leader' | 'co_leader' | null;
}

interface DashboardCarProps {
	titleIconName?: TITLE_ICON_MAP
	emptyIconName?: EMPTY_ICON_MAP;
	title: string
	emptyMessage: string
	isEmpty: boolean
	showActionButton?: boolean
	actionButtonText?: string
	isLoading?: boolean
	onActionClick?: () => void
	groupData?: GroupData | null
	children?: ReactNode
}

import styles from './DashboardCard.module.scss';

export const DashboardCard = ({
	emptyIconName,
	titleIconName,
	title = 'No title provided',
	emptyMessage = '',
	isEmpty = false,
	isLoading = false,
	showActionButton = false,
	actionButtonText,
	onActionClick,
	groupData,
	children
}: DashboardCarProps) => {

	const hasGroup = groupData && groupData.my_role === 'leader';

	// Determine button text based on context
	const buttonText = actionButtonText || (hasGroup ? 'Update Group' : 'Create Group');

	return (
		<div className={styles.contentCard}>
			<header>
				<h2 className={styles.contentCardTitle}>
					<Icon name={titleIconName || 'DashboardIcon'} />
					{title}
				</h2>
				<div>
					<InlineLoader isFetching={isLoading} />
					{showActionButton ? (
						<Button
						className={styles.root__buttoncreate}
						onClick={onActionClick}
						size="small"
						isDisabled={isLoading}
						variant={hasGroup ? 'secondary' : 'primary'}
						data-create-button
					>
						<Icon name="MeetingIcon" />
						<span>{buttonText}</span>
					</Button>
					) : null }
				</div>
			</header>

			<div className={styles.empty_content} hidden={!isEmpty || !!hasGroup}>
				{isEmpty && !hasGroup ? (
					<>
						<Icon name={emptyIconName || 'EmptyGroupIcon'} />
						<p>{emptyMessage}</p>
					</>
				) : null }
			</div>
			<div className={styles.main_content} hidden={isEmpty && !hasGroup}>
				{children}
				{/* Show group info if group exists */}
				{hasGroup && groupData && (
					<GroupSummaryCard groupData={groupData} showStatus={false} />
				)}
			</div>
		</div>
	);

};

export default DashboardCard;
