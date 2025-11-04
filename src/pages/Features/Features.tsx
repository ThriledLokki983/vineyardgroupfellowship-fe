import Layout from 'components/Layout/Layout';
import styles from './Features.module.scss'

function Features() {

  return (
    <Layout variant="centered">
      <div className={styles.constructionContainer}>
        <div className={styles.constructionIcon}>🚧</div>

        <h1 className={styles.title}>Vineyard Group Fellowship - Feature Roadmap</h1>

        <div className={styles.statusBadge}>
          <span className={styles.pulse}></span>
          Building Together
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🤝 Empowering Community Connections</h2>
          <p className={styles.mainMessage}>
            We're building a comprehensive platform to support meaningful fellowship and community engagement.
          </p>
          <p className={styles.subMessage}>
            Here's what's on our roadmap:
          </p>

          {/* Core Features - Implemented */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>✅ Core Features (Live Now!)</h3>
            <ul className={styles.featureList}>
              <li>👥 <strong>Fellowship Groups</strong> - Create, join, browse, and manage community groups</li>
              <li>📅 <strong>Group Meetings</strong> - Schedule and track in-person, virtual, and hybrid gatherings</li>
              <li>🤝 <strong>Member Connections</strong> - View group members and build relationships</li>
              <li>📊 <strong>Group Dashboard</strong> - Manage group activities, members, and join requests</li>
              <li>🔐 <strong>Privacy Controls</strong> - Secure groups with public, community, or private visibility</li>
              <li>🎯 <strong>Focus Areas</strong> - Customize groups around specific interests and purposes</li>
              <li>📍 <strong>Location Search</strong> - Find groups by location with Google Places integration</li>
              <li>📸 <strong>Group Photos</strong> - Upload and display group photos</li>
              <li>👨‍💼 <strong>Leadership Roles</strong> - Group leaders and co-leaders with distinct permissions</li>
            </ul>
          </div>

          {/* Community & Support */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>� Community & Communication (Coming Soon)</h3>
            <ul className={styles.featureList}>
              <li>💭 <strong>Group Discussions</strong> - Topic-based conversations within groups</li>
              <li>� <strong>Direct Messaging</strong> - Private, secure member-to-member communication</li>
              <li>� <strong>Notifications</strong> - Stay connected with group updates and announcements</li>
              <li>� <strong>Group Announcements</strong> - Important updates and news from group leaders</li>
              <li>👋 <strong>Member Directory</strong> - Connect with members based on shared interests</li>
              <li>🗳️ <strong>Polls & Surveys</strong> - Gather input and make group decisions together</li>
            </ul>
          </div>

          {/* Engagement & Activities */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>🎯 Engagement & Activities (Planned)</h3>
            <ul className={styles.featureList}>
              <li>� <strong>Event Calendar</strong> - Plan and track group events and activities</li>
              <li>� <strong>Attendance Tracking</strong> - Monitor participation and engagement</li>
              <li>🎉 <strong>Milestone Celebrations</strong> - Recognize member achievements and anniversaries</li>
              <li>📊 <strong>Engagement Dashboard</strong> - Visual insights into group participation</li>
              <li>🏆 <strong>Recognition System</strong> - Celebrate active members and contributions</li>
              <li>� <strong>Photo Sharing</strong> - Share moments and memories with your group</li>
            </ul>
          </div>

          {/* Resources & Content */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>📚 Resources & Content (Future)</h3>
            <ul className={styles.featureList}>
              <li>📖 <strong>Resource Library</strong> - Share articles, documents, and materials</li>
              <li>� <strong>Media Gallery</strong> - Videos, audio, and multimedia content</li>
              <li>📝 <strong>Group Notes</strong> - Collaborative documents and meeting notes</li>
              <li>� <strong>Bookmarks & Favorites</strong> - Save and organize important content</li>
              <li>📋 <strong>Templates</strong> - Pre-built formats for meetings, agendas, and activities</li>
              <li>🎓 <strong>Study Materials</strong> - Shared learning resources for group study</li>
            </ul>
          </div>

          {/* Advanced Features */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>🚀 Enhanced Group Features (Long-term Vision)</h3>
            <ul className={styles.featureList}>
              <li>📊 <strong>Group Analytics</strong> - Attendance patterns and engagement insights for leaders</li>
              <li>🗺️ <strong>Meeting Discovery</strong> - Find nearby in-person groups with map view</li>
              <li>📞 <strong>Video Meetings</strong> - Built-in virtual meeting rooms for groups</li>
              <li>� <strong>Live Chat</strong> - Real-time group conversations during events</li>
              <li>� <strong>Sub-Groups</strong> - Create specialized groups within larger communities</li>
              <li>🔗 <strong>Group Linking</strong> - Connect related groups and share resources</li>
              <li>� <strong>Multi-Group Calendar</strong> - View events across all your groups</li>
              <li>🌍 <strong>Multi-language Support</strong> - Serve diverse communities worldwide</li>
            </ul>
          </div>

          {/* Leadership & Management */}
          <div className={styles.featureSection}>
            <h3 className={styles.sectionTitle}>👨‍� Leadership & Management (Future)</h3>
            <ul className={styles.featureList}>
              <li>� <strong>Co-Leader Roles</strong> - Share leadership responsibilities</li>
              <li>📋 <strong>Task Management</strong> - Assign and track group tasks</li>
              <li>� <strong>Reports & Insights</strong> - Generate group activity and engagement reports</li>
              <li>🔄 <strong>Role Permissions</strong> - Customizable member permissions and access levels</li>
              <li>� <strong>Email Integration</strong> - Send group updates via email</li>
              <li>💼 <strong>Leadership Resources</strong> - Tools and guides for effective group leadership</li>
              <li>🎯 <strong>Goal Setting</strong> - Set and track group objectives and milestones</li>
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
              🌱 <strong>Building community, one connection at a time.</strong> Start your group today.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Features