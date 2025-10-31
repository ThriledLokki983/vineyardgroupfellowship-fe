import Layout from '../../components/Layout/Layout'
import styles from './LegalPage.module.scss'

export default function PrivacyPolicyPage() {
  return (
    <Layout variant="default">
      <div className={styles.legalPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>Last updated: October 11, 2025</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Introduction</h2>
            <p>
              At Vineyard Group Fellowship, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website
              and services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Account information (name, email address, username)</li>
              <li>Profile information</li>
              <li>Recovery progress and journal entries</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Send you updates and support messages</li>
              <li>Personalize your experience</li>
              <li>Ensure the security of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
              the Internet is 100% secure.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to certain processing activities</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information.
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@Vineyard Group Fellowship.site" className={styles.link}>
                privacy@Vineyard Group Fellowship.site
              </a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
