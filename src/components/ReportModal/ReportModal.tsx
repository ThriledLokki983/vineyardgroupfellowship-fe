/**
 * ReportModal Component
 * Modal for reporting conversations or messages for moderation
 */

import { useState } from 'react';
import { Modal, Button } from 'components';
import { useReportConversation, useReportMessage } from '../../hooks/messaging/useSafety';
import type { ReportReason } from '../../types/private-messaging';
import styles from './ReportModal.module.scss';

export interface ReportModalProps {
	isOpen: boolean;
	onClose: () => void;
	type: 'conversation' | 'message';
	targetId: string; // conversation_id or message_id
	targetName?: string; // For display purposes
}

const REPORT_REASONS: Array<{ value: ReportReason; label: string }> = [
	{ value: 'spam', label: 'Spam or unwanted messages' },
	{ value: 'harassment', label: 'Harassment or bullying' },
	{ value: 'inappropriate_content', label: 'Inappropriate content' },
	{ value: 'safety_concern', label: 'Safety concern' },
	{ value: 'other', label: 'Other' },
];

export const ReportModal = ({
	isOpen,
	onClose,
	type,
	targetId,
	targetName
}: ReportModalProps) => {
	const [reason, setReason] = useState<ReportReason>('spam');
	const [details, setDetails] = useState('');

	const reportConversation = useReportConversation();
	const reportMessage = useReportMessage();

	const handleSubmit = () => {
		const reportData = {
			reason,
			details: details.trim() || undefined
		};

		if (type === 'conversation') {
			reportConversation.mutate({
				conversation_id: targetId,
				...reportData
			});
		} else {
			reportMessage.mutate({
				message_id: targetId,
				...reportData
			});
		}

		// Reset form and close
		handleClose();
	};

	const handleClose = () => {
		setReason('spam');
		setDetails('');
		onClose();
	};

	const isPending = reportConversation.isPending || reportMessage.isPending;
	const isValid = reason && details.trim().length > 0;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={`Report ${type === 'conversation' ? 'Conversation' : 'Message'}`}
			size="md"
		>
			<div className={styles.modalContent}>
				<p className={styles.description}>
					Help us keep the community safe. Your report will be reviewed by our moderation team.
					{targetName && (
						<>
							<br />
							<strong>Reporting: {targetName}</strong>
						</>
					)}
				</p>

				<div className={styles.formGroup}>
					<label htmlFor="report-reason" className={styles.label}>
						Reason <span className={styles.required}>*</span>
					</label>
					<select
						id="report-reason"
						name="report-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value as ReportReason)}
						disabled={isPending}
						className={styles.select}
					>
						{REPORT_REASONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="report-details" className={styles.label}>
						Additional details <span className={styles.required}>*</span>
					</label>
					<textarea
						id="report-details"
						value={details}
						onChange={(e) => setDetails(e.target.value)}
						placeholder="Please provide specific details about why you're reporting this..."
						rows={5}
						className={styles.textarea}
						required
						maxLength={1000}
						disabled={isPending}
					/>
					<div className={styles.characterCount}>
						{details.length} / 1000
					</div>
				</div>

				<p className={styles.note}>
					<strong>Note:</strong> False reports may result in account restrictions.
					Reports are confidential and will not be shared with the reported user.
				</p>

				<div className={styles.actions}>
					<Button
						variant="tertiary"
						onPress={handleClose}
						isDisabled={isPending}
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						onPress={handleSubmit}
						isDisabled={!isValid || isPending}
					>
						{isPending ? 'Submitting...' : 'Submit Report'}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
