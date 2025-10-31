import { Layout, Icon } from 'components';
import * as Icons from 'assets/icons/icons';
import styles from './LoadingState.module.scss';

interface LoadingStateProps {
  icon?: keyof typeof Icons;
  message?: string;
  variant?: 'default' | 'centered' | 'fullscreen';
  showLayout?: boolean;
}

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