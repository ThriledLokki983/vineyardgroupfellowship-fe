import { useMemo } from 'react';
import styles from './Greetings.module.scss';

interface GreetingsProps {
  userName: string;
  /** Optional prefix to add before username (e.g., '@' for member dashboard) */
  userNamePrefix?: string;
}

/**
 * Greetings Component
 * Displays a personalized greeting based on time of day
 */
export const Greetings = ({ userName, userNamePrefix = '' }: GreetingsProps) => {
  /**
   * Compose moment of day string.
   * Output: `morning`, `afternoon`, `evening`, `night`.
   */
  const moment = useMemo(() => {
    const time = new Date();
    const hours = time.getHours();
    if (hours > 4 && hours < 12) {
      return `morning`;
    }
    if (hours < 18) {
      return `afternoon`;
    }
    if (hours < 22) {
      return `evening`;
    }
    return `night`;
  }, []);

  const displayName = userName ? `${userNamePrefix}${userName}` : userNamePrefix ? `${userNamePrefix}user` : '';

  return (
    <div className={styles.impactHeader}>
      <h1 className={styles.welcomeBack}>
        Good {moment} {displayName ? `, ${displayName}` : ''}
      </h1>
    </div>
  );
};

export default Greetings;
