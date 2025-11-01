import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, InlineLoader, Button } from 'components';
import { getGroupDetailsPath } from 'configs/paths';

type EMPTY_ICON_MAP = 'EmptyMailboxIcon' | 'EmptyWritingIcon' | 'EmptyGroupIcon';
type TITLE_ICON_MAP = 'OutboxIcon' | 'InboxIcon';

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
	membership_status: 'pending' | 'active' | 'inactive' | 'removed';
}

interface DashboardCarProps {
	titleIconName: TITLE_ICON_MAP
	emptyIconName: EMPTY_ICON_MAP;
	title: string
	emptyMessage: string
	isEmpty: boolean
	showActionButton?: boolean
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
	onActionClick,
	groupData,
	children
}: DashboardCarProps) => {

	const hasGroup = groupData && groupData.my_role === 'leader';

	return (
		<div className={styles.contentCard}>
			<header>
				<h2 className={styles.contentCardTitle}>
					<Icon name={titleIconName} />
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
						<span>{hasGroup ? 'Update' : 'Create'}&nbsp;Group</span>
					</Button>
					) : null }
				</div>
			</header>

			<div className={styles.empty_content} hidden={!isEmpty || !!hasGroup}>
				{isEmpty && !hasGroup ? (
					<>
						<Icon name={emptyIconName} />
						<p>{emptyMessage}</p>
					</>
				) : null }
			</div>
			<div className={styles.main_content} hidden={isEmpty && !hasGroup}>
				{children}
				{/* Show group info if group exists */}
				{hasGroup && groupData && (
					<GroupSummaryDetails groupData={groupData} />
				)}
			</div>
		</div>
	);

};

export default DashboardCard;


interface GroupSummaryDetailsProps {
	groupData: GroupData;
}

const GroupSummaryDetails = ({ groupData }: GroupSummaryDetailsProps) => {

	return (
		<article className={styles.groupInfo}>
			<div className={styles.groupHeader}>
				<h3 className={styles.groupName}>{groupData.name}</h3>
				<span className={styles.groupStatus}>
					{/* <Icon name={groupData.is_open ? 'CheckMarkFillIcon' : 'CrossIcon'} /> */}
					{groupData.is_open ? 'Open' : 'Closed'}
				</span>
			</div>
			<p className={styles.groupDescription}>
				{groupData.description.length > 150
					? `${groupData.description.substring(0, 150)}...`
					: groupData.description
				}
			</p>
			<div className={styles.groupDetails}>
				<div className={styles.groupDetail}>
					<Icon name="LocationIcon" />
					<span>{groupData.location_type === 'in_person' ? 'In Person' : groupData.location_type === 'virtual' ? 'Virtual' : 'Hybrid'}</span>
				</div>
				<div className={styles.groupDetail}>
					<Icon name="ClockIcon" />
					<span>{groupData.meeting_time}</span>
				</div>
				<div className={styles.groupDetail}>
					<Icon name="PersonOutlineIcon" />
					<span>{groupData.current_member_count}/{groupData.member_limit} members</span>
				</div>
			</div>
			{/* <div className={styles.groupStats}>
				<div className={styles.stat}>
					<span className={styles.statValue}>{groupData.available_spots}</span>
					<span className={styles.statLabel}>Available Spots</span>
				</div>
				<div className={styles.stat}>
					<span className={styles.statValue}>{groupData.current_member_count}</span>
					<span className={styles.statLabel}>Current Members</span>
				</div>
			</div> */}
			<Link to={getGroupDetailsPath(groupData.id)} className={styles.viewDetailsLink}>
				<span>View Full Details</span>
				<Icon name="ArrowRight" />
			</Link>
		</article>
	);

};
