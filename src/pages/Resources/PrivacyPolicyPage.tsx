import Layout from '../../components/Layout/Layout'
import styles from './LegalPage.module.scss'

export default function PrivacyPolicyPage() {
  return (
    <Layout variant="default">
      <div className={styles.legalPage}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>Last updated: October 31, 2025</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our Commitment to Your Privacy</h2>
            <p>
              At Vineyard Group Fellowship, your privacy and safety are sacred to us. We understand that recovery is a deeply personal journey, 
              and we are committed to protecting your confidentiality while fostering a supportive community environment. This Privacy Policy 
              explains how we collect, use, protect, and respect your information when you use our fellowship platform.
            </p>
            <p>
              <strong>Core Principle:</strong> Your recovery journey is yours to share as you choose. We will never compromise your privacy 
              or use your personal information in ways that could harm your recovery or wellbeing.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Information We Collect</h2>
            
            <h3>Account & Profile Information</h3>
            <p>To create your fellowship experience, we collect:</p>
            <ul>
              <li><strong>Basic account details:</strong> Name (which can be anonymous), email address, username</li>
              <li><strong>Profile information:</strong> Recovery goals, preferred fellowship circles, communication preferences</li>
              <li><strong>Optional details:</strong> Age range, location (city/state only), recovery milestones</li>
            </ul>

            <h3>Fellowship Activities</h3>
            <p>To support your recovery journey, we may collect:</p>
            <ul>
              <li><strong>Check-in responses:</strong> Your daily reflections and mood tracking (always optional)</li>
              <li><strong>Meeting participation:</strong> Attendance records for support group meetings you join</li>
              <li><strong>Community interactions:</strong> Messages in fellowship circles, support given/received</li>
              <li><strong>Progress tracking:</strong> Recovery milestones, streak counters, personal insights</li>
            </ul>

            <h3>Technical Information</h3>
            <p>For platform security and improvement:</p>
            <ul>
              <li>Device information, IP address, browser type</li>
              <li>App usage patterns and feature interactions</li>
              <li>Error logs and performance data</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How We Use Your Information</h2>
            
            <h3>Supporting Your Recovery</h3>
            <ul>
              <li><strong>Personalized experience:</strong> Match you with appropriate fellowship circles and sponsors</li>
              <li><strong>Progress tracking:</strong> Help you visualize your recovery journey and celebrate milestones</li>
              <li><strong>Community building:</strong> Connect you with others who share similar experiences or goals</li>
              <li><strong>Crisis support:</strong> Provide immediate resources if you indicate you're struggling</li>
            </ul>

            <h3>Platform Operations</h3>
            <ul>
              <li>Maintain and improve our fellowship platform</li>
              <li>Send recovery support messages and meeting reminders (with your consent)</li>
              <li>Ensure community safety through content moderation</li>
              <li>Provide customer support and respond to your questions</li>
              <li>Comply with legal obligations while protecting your privacy</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Information Sharing & Community Safety</h2>
            
            <h3>Within Fellowship Circles</h3>
            <p>
              Information you choose to share in fellowship circles (support groups, sponsor relationships, community posts) 
              is visible to other circle members. You control what you share and can maintain anonymity.
            </p>

            <h3>With Service Providers</h3>
            <p>
              We work with trusted partners who help us operate the platform (hosting, analytics, customer support). 
              These partners are bound by strict confidentiality agreements and cannot use your data for their own purposes.
            </p>

            <h3>Legal Requirements</h3>
            <p>
              We may disclose information only when required by law or to protect safety. In recovery contexts, 
              we follow applicable mental health and addiction treatment confidentiality laws.
            </p>

            <h3>What We Never Do</h3>
            <ul>
              <li>Sell your personal information to third parties</li>
              <li>Share your recovery details with employers, insurance companies, or family without your consent</li>
              <li>Use your struggles or setbacks for marketing purposes</li>
              <li>Compromise your anonymity within the community</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Data Security & Protection</h2>
            <p>
              Your recovery data deserves the highest level of protection. We implement enterprise-grade security measures:
            </p>
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
              <li><strong>Access controls:</strong> Strict employee access policies with need-to-know basis</li>
              <li><strong>Regular security audits:</strong> Continuous monitoring and vulnerability assessments</li>
              <li><strong>HIPAA-aligned practices:</strong> We follow healthcare-level privacy standards</li>
              <li><strong>Secure infrastructure:</strong> Industry-leading cloud security with 99.9% uptime</li>
            </ul>
            <p>
              While no system is 100% secure, we continuously invest in protecting your information and will 
              notify you promptly of any security incidents.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Your Privacy Rights & Controls</h2>
            
            <h3>You Have the Right To:</h3>
            <ul>
              <li><strong>Access:</strong> View all personal information we have about you</li>
              <li><strong>Correct:</strong> Update or fix any inaccurate information</li>
              <li><strong>Delete:</strong> Request complete removal of your account and data</li>
              <li><strong>Export:</strong> Download your recovery progress and fellowship history</li>
              <li><strong>Limit sharing:</strong> Control what information is visible to other community members</li>
              <li><strong>Opt-out:</strong> Unsubscribe from communications while keeping your account</li>
            </ul>

            <h3>Recovery-Specific Controls</h3>
            <ul>
              <li>Set your anonymity level within fellowship circles</li>
              <li>Choose which milestones and progress to share</li>
              <li>Control sponsor and peer communication preferences</li>
              <li>Temporarily pause your account during challenging periods</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Special Considerations for Recovery</h2>
            
            <h3>Crisis Situations</h3>
            <p>
              If you indicate thoughts of self-harm or substance abuse emergency, we may share minimal necessary information 
              with crisis intervention services to ensure your safety. Your wellbeing always comes first.
            </p>

            <h3>Family & Emergency Contacts</h3>
            <p>
              You can designate emergency contacts who may be notified in crisis situations. This is entirely optional 
              and under your control.
            </p>

            <h3>Recovery Progress</h3>
            <p>
              Your recovery milestones, setbacks, and progress tracking are private by default. You choose what to share 
              with the community and what to keep personal.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Cookies & Tracking</h2>
            <p>
              We use minimal, essential cookies to provide our service:
            </p>
            <ul>
              <li><strong>Authentication cookies:</strong> Keep you safely logged in</li>
              <li><strong>Preference cookies:</strong> Remember your settings and anonymity choices</li>
              <li><strong>Analytics cookies:</strong> Help us improve the platform (aggregated data only)</li>
            </ul>
            <p>
              You can control cookie settings in your browser. Disabling certain cookies may limit some platform features 
              but will never prevent you from accessing recovery support.
            </p>
          </section>

          <section className={styles.section}>
            <h2>International Users & Data Transfers</h2>
            <p>
              Your data is primarily stored and processed in the United States with enterprise-grade security protections. 
              If you're outside the US, your information may be transferred to and processed in the US, where our 
              servers are located. We ensure appropriate safeguards are in place regardless of location.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
              We will notify you of significant changes via email and prominent platform notices. 
              Your continued use of Vineyard Group Fellowship after updates constitutes acceptance of the new policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              Your privacy questions and concerns are important to us. Our Privacy Team is here to help:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:privacy@vineyardgroupfellowship.org" className={styles.link}>privacy@vineyardgroupfellowship.org</a></li>
              <li><strong>Privacy Officer:</strong> Available for serious concerns or legal requests</li>
              <li><strong>Community Support:</strong> For questions about fellowship circle privacy settings</li>
            </ul>
            <p>
              <strong>Response Commitment:</strong> We will respond to privacy inquiries within 48 hours and resolve 
              issues within 7 business days whenever possible.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Your Recovery, Your Privacy, Your Choice</h2>
            <p>
              Recovery requires courage, and sharing your journey requires trust. We are honored to be part of your 
              fellowship and committed to protecting the privacy and dignity of every person who seeks support through 
              our community. Your recovery story is yours to tell, and we will always respect that choice.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
