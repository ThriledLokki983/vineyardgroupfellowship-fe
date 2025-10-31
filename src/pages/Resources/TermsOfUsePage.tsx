import Layout from '../../components/Layout/Layout';
import styles from './LegalPage.module.scss'

export default function TermsOfUsePage() {
  return (
    <Layout variant="default">
      <div className={styles.legalPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Terms of Use</h1>
          <p className={styles.subtitle}>Last updated: October 11, 2025</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using Vineyard Group Fellowship, you accept and agree to be bound by the terms and provision of this agreement.
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on Vineyard Group Fellowship for personal, non-commercial use only.
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software contained on Vineyard Group Fellowship</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Disclaimer</h2>
            <p>
              Vineyard Group Fellowship is designed to support recovery but is not a substitute for professional medical advice, diagnosis,
              or treatment. Always seek the advice of your physician or other qualified health provider with any questions you
              may have regarding a medical condition.
            </p>
          </section>

          <section className={styles.section}>
            <h2>User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information.
              Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your password
              and for all activities that occur under your account.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Prohibited Uses</h2>
            <p>You may not use Vineyard Group Fellowship:</p>
            <ul>
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any advertising or promotional material</li>
              <li>To impersonate or attempt to impersonate another user</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use of the service</li>
              <li>To harass, abuse, or harm another person</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive property of
              Vineyard Group Fellowship and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms. Upon termination, your right to use the service will
              immediately cease.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Vineyard Group Fellowship, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable
              for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of
              profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to
              provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@Vineyard Group Fellowship.site" className={styles.link}>
                legal@Vineyard Group Fellowship.site
              </a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
