import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import LoginLogo from '../../assets/login-logo.svg?react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './MinimalHome.module.scss';

export default function MinimalPublicHome() {
  const navigate = useNavigate();

  // Scroll animations for each section
  const trustSection = useScrollAnimation({ threshold: 0.3 });
  const pillarsSection = useScrollAnimation({ threshold: 0.2 });
  const statSection = useScrollAnimation({ threshold: 0.3 });
  const ctaSection = useScrollAnimation({ threshold: 0.3 });

  const corePillars = [
    {
      icon: '👥',
      title: 'Join a Circle',
      description: 'Connect with small, supportive groups for deeper fellowship'
    },
    {
      icon: '🤝',
      title: 'Find a Sponsor',
      description: 'Get matched with experienced members who guide you'
    },
    {
      icon: '💬',
      title: 'Always Supported',
      description: 'Access peer support anytime through our community'
    }
  ];

  return (
    <div className={styles.minimalHome}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.logoContainer}>
          <LoginLogo className={styles.logo} aria-label="Vineyard Group Fellowship" />
        </div>

        <h1 className={styles.heroTitle}>
          Find Your Fellowship.<br />Find Your Freedom.
        </h1>

        <p className={styles.heroSubtitle}>
          A compassionate community where recovery, growth, and healing happen together.
        </p>

        <div className={styles.heroCTAs}>
          <Button
            variant="primary"
            size="large"
            onPress={() => navigate('/register')}
          >
            Join Fellowship
          </Button>
          <Button
            variant="secondary"
            size="large"
            onPress={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>

        <button
          className={styles.scrollIndicator}
          onClick={() => {
            document.getElementById('trust-statement')?.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Learn more"
        >
          <span className={styles.arrow}>↓</span>
        </button>
      </section>

      {/* Trust Statement */}
      <section
        id="trust-statement"
        ref={trustSection.ref as React.RefObject<HTMLElement>}
        className={`${styles.trustStatement} ${trustSection.isVisible ? styles.fadeIn : ''}`}
      >
        <p className={styles.trustText}>
          A safe space for recovery, built on privacy, compassion, and real connection.
        </p>
      </section>

      {/* Core Pillars */}
      <section
        ref={pillarsSection.ref as React.RefObject<HTMLElement>}
        className={`${styles.pillarsSection} ${pillarsSection.isVisible ? styles.fadeIn : ''}`}
      >
        <div className={styles.pillarsGrid}>
          {corePillars.map((pillar, index) => (
            <div key={index} className={styles.pillar}>
              <div className={styles.pillarIcon}>{pillar.icon}</div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDescription}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Single Stat */}
      <section
        ref={statSection.ref as React.RefObject<HTMLElement>}
        className={`${styles.statSection} ${statSection.isVisible ? styles.fadeIn : ''}`}
      >
        <div className={styles.statNumber}>15,000+</div>
        <p className={styles.statDescription}>members supporting each other daily</p>
      </section>

      {/* Final CTA */}
      <section
        ref={ctaSection.ref as React.RefObject<HTMLElement>}
        className={`${styles.finalCTA} ${ctaSection.isVisible ? styles.fadeIn : ''}`}
      >
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>You don't have to journey alone.</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands who've found hope, healing, and authentic fellowship.
          </p>
          <Button
            variant="primary"
            size="large"
            onPress={() => navigate('/register')}
          >
            Join Our Fellowship
          </Button>
        </div>
      </section>
    </div>
  );
}
