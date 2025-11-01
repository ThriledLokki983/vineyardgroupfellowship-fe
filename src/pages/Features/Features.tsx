import Layout from 'components/Layout/Layout';
import styles from './Features.module.scss'

function Features() {

  return (
    <Layout variant="centered">
      <div className={styles.constructionContainer}>
        <div className={styles.constructionIcon}>�</div>

        <h1 className={styles.title}>Vineyard Group Fellowship - Feature Roadmap</h1>

        <div className={styles.statusBadge}>
          <span className={styles.pulse}></span>
          Building Together
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>� Empowering Your Recovery Journey</h2>
          <p className={styles.mainMessage}>
            We're building a comprehensive platform to support every step of your path to freedom and wellness.
          </p>
          <p className={styles.subMessage}>
            Here's what's on our roadmap:
          </p>

          {/* Core Features - In Development */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>🔨 Core Features (In Development)</h3>
            <ul className={styles.featureList}>
              <li>👥 <strong>Fellowship Groups</strong> - Create, join, and manage recovery support groups</li>
              <li>📅 <strong>Group Meetings</strong> - Schedule and track in-person, virtual, and hybrid meetings</li>
              <li>🤝 <strong>Member Connections</strong> - Build meaningful relationships with fellow members</li>
              <li>📊 <strong>Group Dashboard</strong> - Manage group activities, members, and requests</li>
              <li>🔐 <strong>Privacy Controls</strong> - Secure, private spaces for sharing and healing</li>
            </ul>
          </div>

          {/* Progress & Accountability */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>📈 Progress & Accountability (Coming Soon)</h3>
            <ul className={styles.featureList}>
              <li>🎯 <strong>Personal Goals</strong> - Set and track recovery milestones</li>
              <li>📆 <strong>Sobriety Tracker</strong> - Celebrate days, weeks, months, and years</li>
              <li>📝 <strong>Daily Check-ins</strong> - Quick reflections and mood tracking</li>
              <li>📊 <strong>Progress Dashboard</strong> - Visual insights into your journey</li>
              <li>🏆 <strong>Milestone Celebrations</strong> - Recognize achievements with your community</li>
              <li>⚡ <strong>Habit Tracking</strong> - Build healthy routines and break harmful ones</li>
            </ul>
          </div>

          {/* Community & Support */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>💬 Community & Support (Planned)</h3>
            <ul className={styles.featureList}>
              <li>💭 <strong>Group Discussions</strong> - Topic-based conversations within groups</li>
              <li>📱 <strong>Direct Messaging</strong> - Private, secure member-to-member communication</li>
              <li>🆘 <strong>Crisis Support</strong> - Quick access to emergency resources and hotlines</li>
              <li>👋 <strong>Accountability Partners</strong> - Connect with sponsors and accountability buddies</li>
              <li>🔔 <strong>Notifications</strong> - Stay connected with group updates and messages</li>
            </ul>
          </div>

          {/* Resources & Education */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>📚 Resources & Wellness (Future)</h3>
            <ul className={styles.featureList}>
              <li>📖 <strong>Resource Library</strong> - Articles, videos, and recovery materials</li>
              <li>🎧 <strong>Guided Meditations</strong> - Audio content for mindfulness and stress relief</li>
              <li>📝 <strong>Recovery Journal</strong> - Private journaling space with prompts</li>
              <li>🧘 <strong>Wellness Tools</strong> - Breathing exercises, coping strategies, triggers management</li>
              <li>🎓 <strong>Step Work Programs</strong> - Structured programs for recovery methodologies</li>
            </ul>
          </div>

          {/* Advanced Features */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>🚀 Enhanced Group Features (Long-term Vision)</h3>
            <ul className={styles.featureList}>
              <li>� <strong>Group Analytics</strong> - Attendance patterns and engagement insights for leaders</li>
              <li>🗺️ <strong>Meeting Discovery</strong> - Find nearby in-person groups with map view</li>
              <li>📞 <strong>Video Meetings</strong> - Built-in virtual meeting rooms for groups</li>
              <li>📸 <strong>Story Sharing</strong> - Share recovery milestones and victories (optional)</li>
              <li>🏅 <strong>Achievement System</strong> - Celebrate milestones and community participation</li>
              <li>💝 <strong>Service Work</strong> - Volunteer opportunities for giving back to the community</li>
              <li>🌍 <strong>Multi-language Support</strong> - Serve diverse recovery communities worldwide</li>
            </ul>
          </div>

          {/* Resources & Education */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>📚 Resources & Education (Future)</h3>
            <ul className={styles.featureList}>
              <li>📖 <strong>Resource Library</strong> - Articles, videos, and recovery materials</li>
              <li>🎧 <strong>Guided Meditations</strong> - Audio content for mindfulness and stress relief</li>
              <li>📝 <strong>Recovery Journal</strong> - Private journaling space with prompts</li>
              <li>🧘 <strong>Wellness Tools</strong> - Breathing exercises, coping strategies, triggers management</li>
              <li>📅 <strong>Event Calendar</strong> - Find local and virtual recovery events</li>
              <li>🎓 <strong>Educational Programs</strong> - Structured learning paths for recovery topics</li>
            </ul>
          </div>

          {/* Advanced Features */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>🚀 Advanced Features (Long-term Vision)</h3>
            <ul className={styles.featureList}>
              <li>📊 <strong>Analytics & Insights</strong> - Pattern recognition in triggers and successes</li>
              <li>🤖 <strong>AI Wellness Coach</strong> - Personalized recommendations and support</li>
              <li>🗺️ <strong>Group Finder Map</strong> - Discover nearby groups with map view</li>
              <li>� <strong>Memory Sharing</strong> - Share recovery milestones and victories</li>
              <li>🏅 <strong>Gamification</strong> - Earn badges and rewards for consistency</li>
              <li>👨‍👩‍👧‍👦 <strong>Family Support</strong> - Resources and tools for loved ones</li>
              <li>🔗 <strong>Integration Hub</strong> - Connect with therapy apps, calendars, and health trackers</li>
              <li>🌍 <strong>Multi-language Support</strong> - Serve communities worldwide</li>
              <li>📞 <strong>Video Meetings</strong> - Built-in virtual meeting rooms for groups</li>
              <li>💝 <strong>Giving Back</strong> - Share your story to inspire newcomers</li>
            </ul>
          </div>

          <div className={styles.ctaSection}>
            <p className={styles.ctaText}>
              ✨ <strong>Your Feedback Shapes Our Future</strong>
            </p>
            <p className={styles.readTheDocs}>
              We're building this platform <em>with</em> our community, not just for it. Join us today,
              explore what's available, and help us prioritize features that matter most to you.
            </p>
            <p className={styles.readTheDocs}>
              🌱 <strong>Every great journey begins with a single step.</strong> Start yours today.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Features