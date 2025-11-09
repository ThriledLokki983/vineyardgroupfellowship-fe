/**
 * BlockUserModal Component
 * Modal for confirming and blocking a user from messaging
 */

import { useState } from 'react';
import { Modal, Button } from 'components';
import { useBlockUser } from '../../hooks/messaging/useSafety';
import styles from './BlockUserModal.module.scss';

export interface BlockUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	userName: string;
	userId: string;
}

export const BlockUserModal = ({
	isOpen,
	onClose,
	userName,
	userId
}: BlockUserModalProps) => {
	const [reason, setReason] = useState('');
	const blockUser = useBlockUser();

	const handleBlock = () => {
		blockUser.mutate({
			user_id: userId,
			reason: reason.trim() || undefined
		});

		// Modal will close via navigation in the hook
		setReason(''); // Clear reason for next time
	};

	const handleClose = () => {
		setReason(''); // Clear reason when closing
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={`Block ${userName}?`}
			size="sm"
		>
			<div className={styles.modalContent}>
				<p className={styles.warningText}>
					Blocking this user will:
				</p>
				<ul className={styles.consequencesList}>
					<li>Prevent them from messaging you</li>
					<li>Hide your existing conversations</li>
					<li>Remove them from your contacts</li>
				</ul>

				<p className={styles.note}>
					You can unblock them later from Settings.
				</p>

				<div className={styles.formGroup}>
					<label htmlFor="block-reason" className={styles.label}>
						Reason (optional)
					</label>
					<textarea
						id="block-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Why are you blocking this user?"
						rows={3}
						className={styles.textarea}
						maxLength={500}
						disabled={blockUser.isPending}
					/>
					<div className={styles.characterCount}>
						{reason.length} / 500
					</div>
				</div>

				<div className={styles.actions}>
					<Button
						variant="tertiary"
						onPress={handleClose}
						isDisabled={blockUser.isPending}
					>
						Cancel
					</Button>
					<Button
						variant="secondary"
						onPress={handleBlock}
						isDisabled={blockUser.isPending}
						className={styles.blockButton}
					>
						{blockUser.isPending ? 'Blocking...' : 'Block User'}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
