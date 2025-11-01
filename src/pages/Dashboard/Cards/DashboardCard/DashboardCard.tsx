import type { ReactNode } from 'react';
import { Icon } from 'components';

// type IconName = 'CompactIcon' | 'RelaxedIcon' | 'Writing' | 'Mailbox' | 'CrossIcon';

// const ICON_MAP: Record<string, IconName> = {
//   compactIcon: 'CompactIcon',
//   relaxedIcon: 'RelaxedIcon',
//   mailbox: 'Mailbox',
//   writing: 'Writing',
// };

type EMPTY_ICON_MAP = 'EmptyMailboxIcon' | 'EmptyWritingIcon' | 'EmptyGroupIcon';
type TITLE_ICON_MAP = 'OutboxIcon' | 'InboxIcon';

interface DashboardCarProps {
	titleIconName: TITLE_ICON_MAP
	emptyIconName: EMPTY_ICON_MAP;
	title: string
	emptyMessage: string
	isEmpty: boolean
	children?: ReactNode
}

import styles from './DashboardCard.module.scss';

export const DashboardCard = ({
	emptyIconName,
	titleIconName,
	title = 'No title provided',
	emptyMessage = '',
	isEmpty = false,
	children
}: DashboardCarProps) => {

	return (
		<div className={styles.contentCard}>
			<header>
				<h2 className={styles.contentCardTitle}>
					<Icon name={titleIconName} />
					{title}
				</h2>
				<div>
					{/* <InlineLoader isFetching={!meetState.hasFetched} /> */}
				</div>
			</header>
			<div className={styles.empty_content} hidden={!isEmpty}>
				{isEmpty ? (
					<>
						<Icon name={emptyIconName} />
						<p>{emptyMessage}</p>
					</>
				) : null }
			</div>
			<div className={styles.main_content} hidden={isEmpty}>
				{children}
			</div>
		</div>
	);

};

export default DashboardCard;
