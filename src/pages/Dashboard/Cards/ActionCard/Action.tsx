import styles from './Action.module.scss';
import { Button, Icon } from 'components';
import type { SupporterNextStep } from 'configs/hooks-interfaces';

type Step = {
	step: string;
	title: string;
	description: string
	url: string;
	priority: 'high' | 'low' | 'medium'
}

interface ActionProps {
	action?: string | Step;
	type: 'missing' | 'support';
	nextStep?: SupporterNextStep;
}

const getCleanName = (value: string) => {
	switch (value) {
		case 'recovery_stage':
			return 'Recovery Stage';
		case 'complete_training':
			return 'Supporter Training';
		case 'complete_background':
			return 'Background Information';
		case 'verify_credentials':
			return 'Professional Credentials';
		case 'update_availability':
			return 'Availability Settings';
		default:
			return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	}
};

const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
	switch (priority) {
		case 'high':
			return 'ExclamationTriangleIcon';
		case 'medium':
			return 'ExclamationCircleIcon';
		case 'low':
			return 'CheckMarkFillIcon';
		default:
			return 'BubbleIcon';
	}
};

const Action = ({ action, type, nextStep }: ActionProps) => {
	if (type === 'missing' && action && typeof action === 'string') {
		return (
			<div className={styles.root}>
				<span>Your {getCleanName(action)} is still missing</span>
				<Button
					href='/profile'
					external={false}
					variant='secondary'
					size="small"
				>
					Fix
				</Button>
			</div>
		);
	}



	if (type === 'support') {
		const step = nextStep || (action as Step);

		if (step && typeof step === 'object') {
			return (
				<div className={`${styles.root} ${styles[step.priority]}`}>
					<div className={styles.content}>
						<div className={styles.header}>
							<Icon name={getPriorityIcon(step.priority)} />
							<span className={styles.title}>{step.title}</span>
						</div>
						<p className={styles.description}>{step.description}</p>
					</div>
					<Button
						href={step.url}
						variant={step.priority === 'high' ? 'primary' : 'secondary'}
						size="small"
					>
						Start →
					</Button>
				</div>
			);
		}
	}

	return (
		<div className={styles.root}>
			<span>No action required</span>
		</div>
	);
};

export default Action;