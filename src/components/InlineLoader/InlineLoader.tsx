import styles from './InlineLoader.module.scss';


/**
 * Based on: https://cssloaders.github.io/
 */
export const InlineLoader = ({ isFetching = true }) => {

  return (
    <div className={styles.root} aria-hidden={!isFetching} role="presentation" inline-loader="">
      <div className={styles.root__loader}></div>
    </div>
  );

};

export default InlineLoader;
