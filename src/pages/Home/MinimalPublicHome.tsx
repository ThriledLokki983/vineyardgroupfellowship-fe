// import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import logoLight from '../../assets/new-logopng.png';
// import logoLight1 from '../../assets/new-header-logo-light-theme.png';
// import logoDark from '../../assets/new-header-logo-dark-theme.png';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import styles from './MinimalHome.module.scss';

export default function MinimalPublicHome() {
  const navigate = useNavigate();

  // Detect theme (light or dark)
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   // Check initial theme
  //   const checkTheme = () => {
  //     const theme = document.documentElement.getAttribute('data-theme');
  //     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //     setIsDarkMode(theme === 'dark' || (!theme && prefersDark));
  //   };

  //   checkTheme();

  //   // Watch for theme changes
  //   const observer = new MutationObserver(checkTheme);
  //   observer.observe(document.documentElement, {
  //     attributes: true,
  //     attributeFilter: ['data-theme']
  //   });

  //   // Watch for system preference changes
  //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   const handleChange = (e: MediaQueryListEvent) => {
  //     const theme = document.documentElement.getAttribute('data-theme');
  //     if (!theme) setIsDarkMode(e.matches);
  //   };
  //   mediaQuery.addEventListener('change', handleChange);

  //   return () => {
  //     observer.disconnect();
  //     mediaQuery.removeEventListener('change', handleChange);
  //   };
  // }, []);

  // const currentLogo = isDarkMode ? logoDark : logoLight;
  const currentLogo = logoLight;

  // Scroll animations for each section
  const trustSection = useScrollAnimation({ threshold: 0.3 });
  const pillarsSection = useScrollAnimation({ threshold: 0.2 });
  const statSection = useScrollAnimation({ threshold: 0.3 });
  const ctaSection = useScrollAnimation({ threshold: 0.3 });

  const corePillars = [
    {
      iconName: 'PeopleIcon' as const,
      title: 'Join a Circle',
      description: 'Connect with small, supportive groups for deeper fellowship'
    },
    {
      iconName: 'HandCircleIcon' as const,
      title: 'Find a Sponsor',
      description: 'Get matched with experienced members who guide you'
    },
    {
      iconName: 'ChatBubbleIcon' as const,
      title: 'Always Supported',
      description: 'Access peer support anytime through our community'
    }
  ];

  return (
    <div className={styles.minimalHome}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.logoContainer}>
          <img
            src={currentLogo}
            alt="Vineyard Group Fellowship"
            className={styles.logo}
          />
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
              <div className={styles.pillarIcon}>
                <Icon name={pillar.iconName} />
              </div>
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
