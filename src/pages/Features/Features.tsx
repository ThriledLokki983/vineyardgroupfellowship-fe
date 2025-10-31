import Layout from 'components/Layout/Layout';
import styles from './Features.module.scss'

function Features() {

  return (
    <Layout variant="centered">
      <div className={styles.constructionContainer}>
        <div className={styles.constructionIcon}>🚧</div>

        <h1 className={styles.title}>Vineyard Group Fellowship - Features Preview</h1>

        <div className={styles.statusBadge}>
          <span className={styles.pulse}></span>
          Under Construction
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🌱 Something Amazing is Growing Here</h2>
          <p className={styles.mainMessage}>
            We're building a powerful platform to support your journey to freedom and wellness.
          </p>
          <p className={styles.subMessage}>
            Our team is working hard to bring you:
          </p>

          <ul className={styles.featureList}>
            <li>📊 <strong>Progress Tracking</strong> - Visual dashboards for your achievements</li>
            <li>🎯 <strong>Goal Setting</strong> - Personalized milestones and celebrations</li>
            <li>👥 <strong>Community Support</strong> - Connect with others on similar journeys</li>
            <li>📝 <strong>Daily Check-ins</strong> - Stay accountable with simple daily logs</li>
            <li>💡 <strong>Wellness Tools</strong> - Resources for mental health and recovery</li>
          </ul>

          <div className={styles.ctaSection}>
            <p className={styles.ctaText}>
              ✨ <strong>Great things are coming soon!</strong>
            </p>
            <p className={styles.readTheDocs}>
              In the meantime, you can create an account and explore your profile settings.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Features