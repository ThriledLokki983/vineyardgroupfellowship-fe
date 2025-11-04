import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import styles from './HomePage.module.scss'

export default function HomePublic() {
  const navigate = useNavigate()

  const fellowshipFeatures = [
    {
      icon: '👥',
      title: 'Join a Circle',
      description: 'Connect with small, supportive groups led by trained facilitators for deeper fellowship.'
    },
    {
      icon: '🤝',
      title: 'Find Your Sponsor',
      description: 'Get matched with experienced members who can guide you through your recovery journey.'
    },
    {
      icon: '�',
      title: 'Meeting Finder',
      description: 'Discover local and virtual meetings that fit your schedule and recovery needs.'
    },
    {
      icon: '�',
      title: '24/7 Support Chat',
      description: 'Access peer support anytime through our moderated community chat rooms.'
    }
  ]

  const recoveryPaths = [
    {
      title: 'Addiction Recovery',
      description: 'Evidence-based support for substance use recovery',
      icon: '🌱',
      color: 'green'
    },
    {
      title: 'Mental Health',
      description: 'Depression, anxiety, and emotional wellness support',
      icon: '🧠',
      color: 'blue'
    },
    {
      title: 'Life Transitions',
      description: 'Navigate major life changes with community support',
      icon: '🛤️',
      color: 'purple'
    },
    {
      title: 'Grief & Loss',
      description: 'Healing together through loss and bereavement',
      icon: '💙',
      color: 'teal'
    }
  ]

  const communityHighlights = [
    {
      stat: '15,000+',
      label: 'Active Members',
      description: 'People supporting each other daily'
    },
    {
      stat: '500+',
      label: 'Weekly Meetings',
      description: 'Virtual and in-person gatherings'
    },
    {
      stat: '95%',
      label: 'Feel Supported',
      description: 'Members report feeling heard and understood'
    },
    {
      stat: '24/7',
      label: 'Peer Support',
      description: 'Someone is always there when you need them'
    }
  ]

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find Your Fellowship. Find Your Freedom.
          </h1>
          <p className={styles.heroSubtitle}>
            Join a compassionate community where recovery, growth, and healing happen together.
          </p>
          <div className={styles.heroCTAs}>
            <Button
              variant="primary"
              onPress={() => navigate('/register')}
            >
              Join Our Fellowship
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                document.getElementById('fellowship-features')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore Community
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className={styles.section}>
        <div className={styles.statsGrid}>
          {communityHighlights.map((highlight, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statNumber}>{highlight.stat}</div>
              <h3 className={styles.statLabel}>{highlight.label}</h3>
              <p className={styles.statDescription}>{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fellowship Features */}
      <section id="fellowship-features" className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Fellowship Experience</h2>
        <p className={styles.sectionSubtitle}>
          Discover the power of authentic community support
        </p>
        <div className={styles.pillarsGrid}>
          {fellowshipFeatures.map((feature, index) => (
            <div key={index} className={styles.pillarCard}>
              <div className={styles.pillarIcon}>{feature.icon}</div>
              <h3 className={styles.pillarTitle}>{feature.title}</h3>
              <p className={styles.pillarDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recovery Paths */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Find Your Path</h2>
        <p className={styles.sectionSubtitle}>
          Whatever brings you here, there's a community waiting to support you
        </p>
        <div className={styles.pathsGrid}>
          {recoveryPaths.map((path, index) => (
            <div key={index} className={`${styles.pathCard} ${styles[`path-${path.color}`]}`}>
              <div className={styles.pathIcon}>{path.icon}</div>
              <h3 className={styles.pathTitle}>{path.title}</h3>
              <p className={styles.pathDescription}>{path.description}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--size-6)' }}>
          <Button
            variant="tertiary"
            onPress={() => navigate('/register')}
          >
            Find Your Community →
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How Fellowship Works</h2>
        <div className={styles.processGrid}>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Join Safely</h3>
            <p>Create your anonymous profile and share only what you're comfortable with.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Find Your Circle</h3>
            <p>Get matched with small groups based on your journey and needs.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>Grow Together</h3>
            <p>Share, listen, and support each other through every step forward.</p>
          </div>
        </div>
      </section>

      {/* Safe & Private */}
      <section className={styles.privacySection}>
        <div className={styles.section} style={{ padding: 0 }}>
          <h2 className={styles.sectionTitle}>Built on Trust & Safety</h2>
          <p className={styles.sectionSubtitle}>
            Your privacy and wellbeing are sacred to us
          </p>
          <div className={styles.privacyBadges}>
            <div className={styles.privacyBadge}>
              <span className={styles.badgeIcon}>🔒</span>
              <span className={styles.badgeText}>End-to-end encryption</span>
            </div>
            <div className={styles.privacyBadge}>
              <span className={styles.badgeIcon}>👤</span>
              <span className={styles.badgeText}>Anonymous by design</span>
            </div>
            <div className={styles.privacyBadge}>
              <span className={styles.badgeIcon}>🛡️</span>
              <span className={styles.badgeText}>Trained moderators</span>
            </div>
            <div className={styles.privacyBadge}>
              <span className={styles.badgeIcon}>❤️</span>
              <span className={styles.badgeText}>Trauma-informed care</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--size-6)' }}>
            <Button
              variant="tertiary"
              onPress={() => navigate('/privacy')}
            >
              Read Our Community Promise
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className={styles.ctaFooter}>
        <h2 className={styles.ctaFooterTitle}>
          You don't have to journey alone.
        </h2>
        <p className={styles.ctaFooterSubtitle}>
          Join thousands who've found hope, healing, and authentic fellowship in our community.
        </p>
        <Button
          variant="primary"
          onPress={() => navigate('/register')}
          style={{ background: 'white', color: 'var(--brand)' }}
        >
          Begin Your Fellowship Journey
        </Button>
      </section>
    </div>
  )
}
