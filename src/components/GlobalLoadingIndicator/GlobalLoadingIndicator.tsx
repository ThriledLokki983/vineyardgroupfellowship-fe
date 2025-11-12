import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import styles from './GlobalLoadingIndicator.module.scss';

/**
 * GlobalLoadingIndicator
 *
 * Displays a thin loading bar at the top of the screen when any queries or mutations are in progress.
 * Automatically shows/hides based on TanStack Query activity.
 *
 * Uses useIsFetching and useIsMutating to track active operations.
 */
export function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) return null;

  return (
    <div
      className={styles.container}
      role="progressbar"
      aria-label="Loading data"
      aria-live="polite"
    >
      <div className={styles.bar} />
    </div>
  );
}
