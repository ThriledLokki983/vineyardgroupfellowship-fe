import type { DashboardCardProps } from 'types';
import { Icon, InlineLoader, Button } from 'components';
import { GroupSummaryCard } from '../GroupSummaryCard';
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
}: DashboardCardProps) => {

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
