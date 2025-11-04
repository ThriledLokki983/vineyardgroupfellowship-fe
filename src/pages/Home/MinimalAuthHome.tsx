import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/Auth/useAuthContext';
import Button from '../../components/Button';
import styles from './MinimalHome.module.scss';

export default function MinimalAuthHome() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const dailyQuote = "Fellowship is the great medicine for recovery. Together we can do what none of us could do alone.";

  return (
    <div className={styles.minimalHome}>
      <section className={styles.authHero}>
        <div className={styles.authContent}>
          <h1 className={styles.authWelcome}>
            Welcome back, {user?.first_name || `@${user?.display_name_or_email}` || 'Friend'}
          </h1>

          <blockquote className={styles.quote}>
            <p className={styles.quoteText}>"{dailyQuote}"</p>
            <cite className={styles.quoteAuthor}>— Anonymous</cite>
          </blockquote>

          <Button
            variant="primary"
            size="large"
            onPress={() => navigate('/dashboard')}
          >
            Enter Dashboard →
          </Button>
        </div>
      </section>
    </div>
  );
}
