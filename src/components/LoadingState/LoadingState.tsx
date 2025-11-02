import { Layout, Icon } from 'components';
import type { LoadingStateProps } from 'types';
import styles from './LoadingState.module.scss';

export default function LoadingState({
  icon = 'DashboardIcon',
  message = 'Loading...',
  variant = 'centered',
  showLayout = true
}: LoadingStateProps) {

  const content = (
    <div className={styles.loadingContainer}>
      <Icon name={icon} />
      <p>{message}</p>
    </div>
  );

  if (!showLayout) {
    return content;
  };

  return (
    <Layout variant={variant}>
      {content}
    </Layout>
  );

}