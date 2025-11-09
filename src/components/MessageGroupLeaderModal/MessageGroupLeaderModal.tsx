/**
 * MessageGroupLeaderModal Component
 * Modal for sending the initial message to a group leader
 */

import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import styles from './MessageGroupLeaderModal.module.scss';
import { useCreateGroupInquiry } from '../../hooks/messaging/useConversations';
import type { Group } from '../../types/group';

interface MessageGroupLeaderModalProps {
	group: Group;
	onClose: () => void;
}

export function MessageGroupLeaderModal({
	group,
	onClose,
}: MessageGroupLeaderModalProps) {
	const [message, setMessage] = useState('');
	const createInquiry = useCreateGroupInquiry();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!message.trim()) return;

		createInquiry.mutate(
			{
				group_id: group.id,
				message: message.trim(),
			},
			{
				onSuccess: (response) => {
					// Show notification if it's an existing conversation
					if (response.is_existing_conversation) {
						// You can add a toast notification here
						console.log('Continuing existing conversation');
					}
					// The hook automatically navigates to the conversation
					onClose();
				},
			}
		);
	};

	return (
		<Modal isOpen onClose={onClose} title="Message Group Leader">
			<div className={styles.modalContent}>
				<div className={styles.groupInfo}>
					<h3>{group.name}</h3>
					<p className={styles.leaderName}>
						Leader: {group.leader_info?.display_name}
					</p>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.formGroup}>
						<label htmlFor="message" className={styles.label}>
							Your Message
						</label>
						<textarea
							id="message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Hi, I'm interested in learning more about your group. When do you meet?"
							className={styles.textarea}
							rows={6}
							required
							disabled={createInquiry.isPending}
						/>
					</div>

					{createInquiry.isError && (
						<div className={styles.error}>
							Failed to send message. Please try again.
						</div>
					)}

					<div className={styles.actions}>
						<Button
							variant="secondary"
							onPress={onClose}
							isDisabled={createInquiry.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="primary"
							isDisabled={!message.trim() || createInquiry.isPending}
						>
							{createInquiry.isPending ? 'Sending...' : 'Send Message'}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
