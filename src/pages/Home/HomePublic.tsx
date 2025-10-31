import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import styles from './HomePage.module.scss'

export default function HomePublic() {
  const navigate = useNavigate()

  const pillars = [
    {
      icon: '🤝',
      title: 'Community Support',
      description: 'Share experiences anonymously with people who understand your journey.'
    },
    {
      icon: '📈',
      title: 'Track Progress',
      description: 'See your growth day by day with insights and milestones.'
    },
    {
      icon: '📚',
      title: 'Learn & Reflect',
      description: 'Guides and resources curated by experts to support your recovery.'
    }
  ]

  const previews = [
    {
      title: 'Your Dashboard',
      description: 'Track your streak and see your progress at a glance',
      preview: 'Day 15 Streak 🔥'
    },
    {
      title: 'Community Feed',
      description: 'Encouragement and stories from others on the same path',
      preview: 'Anonymous Support'
    }
  ]

  const learningTopics = [
    {
      icon: '🔒',
      title: 'Your Privacy Matters',
      excerpt: 'Learn how we protect your data and keep you anonymous'
    },
    {
      icon: '�',
      title: 'Community Guidelines',
      excerpt: 'Understand our commitment to a safe, supportive space'
    }
  ]

  const privacyBadges = [
    { icon: '🔒', text: 'Your data is never shared' },
    { icon: '👤', text: 'Anonymous by default' }
  ]

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Freedom starts with one step.
          </h1>
          <p className={styles.heroSubtitle}>
            Join thousands finding balance, purpose, and community.
          </p>
          <div className={styles.heroCTAs}>
            <Button
              variant="primary"
              onPress={() => navigate('/register')}
            >
              Start My Journey
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                document.getElementById('how-it-helps')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How It Helps */}
      <section id="how-it-helps" className={styles.section}>
        <h2 className={styles.sectionTitle}>How Vineyard Group Fellowship Helps</h2>
        <p className={styles.sectionSubtitle}>
          A safe, private space designed to support your journey to recovery
        </p>
        <div className={styles.pillarsGrid}>
          {pillars.map((pillar, index) => (
            <div key={index} className={styles.pillarCard}>
              <div className={styles.pillarIcon}>{pillar.icon}</div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDescription}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Peek Inside */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>A Peek Inside</h2>
        <p className={styles.sectionSubtitle}>
          Get a glimpse of what awaits when you join
        </p>
        <div className={styles.previewGrid}>
          {previews.map((preview, index) => (
            <div key={index} className={styles.previewCard}>
              <div className={styles.previewImage}>
                {preview.preview}
              </div>
              <h3 className={styles.previewTitle}>{preview.title}</h3>
              <p className={styles.previewDescription}>{preview.description}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--size-6)' }}>
          <Button
            variant="tertiary"
            onPress={() => navigate('/register')}
          >
            See How It Works →
          </Button>
        </div>
      </section>

      {/* Learn & Grow */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Learn & Grow</h2>
        <p className={styles.sectionSubtitle}>
          Expert-curated content to support your recovery journey
        </p>
        <div className={styles.contentGrid}>
          {learningTopics.map((topic, index) => (
            <div
              key={index}
              className={styles.contentCard}
              onClick={() => navigate(index === 0 ? '/privacy-policy' : '/terms-of-use')}
            >
              <div className={styles.contentIcon}>{topic.icon}</div>
              <div className={styles.contentInfo}>
                <h3 className={styles.contentTitle}>{topic.title}</h3>
                <p className={styles.contentExcerpt}>{topic.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safe & Private */}
      <section className={styles.privacySection}>
        <div className={styles.section} style={{ padding: 0 }}>
          <h2 className={styles.sectionTitle}>Safe & Private</h2>
          <p className={styles.sectionSubtitle}>
            Your privacy and safety are our top priorities
          </p>
          <div className={styles.privacyBadges}>
            {privacyBadges.map((badge, index) => (
              <div key={index} className={styles.privacyBadge}>
                <span className={styles.badgeIcon}>{badge.icon}</span>
                <span className={styles.badgeText}>{badge.text}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--size-6)' }}>
            <Button
              variant="tertiary"
              onPress={() => navigate('/privacy')}
            >
              Read Our Privacy Promise
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className={styles.ctaFooter}>
        <h2 className={styles.ctaFooterTitle}>
          Your journey can begin today — privately, safely, together.
        </h2>
        <p className={styles.ctaFooterSubtitle}>
          Join a community that understands and supports your path to freedom.
        </p>
        <Button
          variant="primary"
          onPress={() => navigate('/register')}
          style={{ background: 'white', color: 'var(--brand-primary)' }}
        >
          Join Vineyard Group Fellowship
        </Button>
      </section>
    </div>
  )
}
