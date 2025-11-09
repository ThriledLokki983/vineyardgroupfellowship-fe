/**
 * MessageMemberModal Component
 * Modal for composing and sending the first direct message to a group member
 */

import { useState } from 'react';
import { Modal, Button } from 'components';
import { useStartDirectMessage } from '../../hooks/messaging/useConversations';
import styles from './MessageMemberModal.module.scss';

export interface MessageMemberModalProps {
	isOpen: boolean;
	onClose: () => void;
	recipientName: string;
	recipientId: string;
	groupId: string;
	groupName?: string;
}

export const MessageMemberModal = ({
	isOpen,
	onClose,
	recipientName,
	recipientId,
	groupId,
	groupName
}: MessageMemberModalProps) => {
	const [message, setMessage] = useState('');
	const startDirectMessage = useStartDirectMessage();

	const handleSend = () => {
		if (!message.trim()) return;

		startDirectMessage.mutate({
			recipient_id: recipientId,
			message: message.trim(),
			group_id: groupId
		});

		// Close modal (navigation happens in the hook)
		onClose();
		setMessage(''); // Clear message for next time
	};

	const handleClose = () => {
		setMessage(''); // Clear message when closing
		onClose();
	};

	const isValid = message.trim().length > 0;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={`Message ${recipientName}`}
			size="md"
		>
			<div className={styles.modalContent}>
				{groupName && (
					<p className={styles.contextInfo}>
						Via <strong>{groupName}</strong>
					</p>
				)}

				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Type your message..."
					rows={6}
					className={styles.textarea}
					autoFocus
					maxLength={1000}
					disabled={startDirectMessage.isPending}
				/>

				<div className={styles.characterCount}>
					{message.length} / 1000
				</div>

				<div className={styles.actions}>
					<Button
						variant="tertiary"
						onPress={handleClose}
						isDisabled={startDirectMessage.isPending}
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						onPress={handleSend}
						isDisabled={!isValid || startDirectMessage.isPending}
					>
						{startDirectMessage.isPending ? 'Sending...' : 'Send Message'}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default MessageMemberModal;
