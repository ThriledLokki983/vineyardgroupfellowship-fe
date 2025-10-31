import { useNavigate } from 'react-router-dom';

import { useAuthContext } from 'contexts/Auth/useAuthContext';

// import { useDailyMessage } from 'hooks/useDailyMessage';

import { Button, AlertBar } from 'components';

import styles from './HomePage.module.scss';

export default function HomeAuthenticated() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  // const { message: dailyMessage, isLoading: isDailyMessageLoading } = useDailyMessage()

  // Check if user needs to complete their profile
  const needsProfileUpdate = !user?.first_name || user.first_name.trim() === ''

  // Mock data - replace with real API calls using TanStack Query
  const lastActive = 'Today at 9:42 AM'
  const currentStreak = 23
  const totalMeetingsAttended = 12
  const supportMessagesReceived = 47

  // Fellowship Dashboard Data
  const fellowshipStats = [
    {
      icon: '�',
      value: `${currentStreak} days`,
      label: 'Recovery Streak',
      trend: '+3 from last week',
      color: 'orange'
    },
    {
      icon: '�',
      value: totalMeetingsAttended.toString(),
      label: 'Meetings Attended',
      trend: 'Great participation!',
      color: 'blue'
    },
    {
      icon: '💬',
      value: supportMessagesReceived.toString(),
      label: 'Support Received',
      trend: 'Community loves you',
      color: 'green'
    },
    {
      icon: '🎯',
      value: '87%',
      label: 'Weekly Check-ins',
      trend: 'Stay consistent!',
      color: 'purple'
    }
  ]

  const todaysActivities = [
    {
      time: '10:00 AM',
      title: 'Morning Circle Check-in',
      type: 'group',
      participants: 8,
      status: 'upcoming'
    },
    {
      time: '2:00 PM',
      title: 'Sponsor Meet: Sarah M.',
      type: 'one-on-one',
      participants: 1,
      status: 'scheduled'
    },
    {
      time: '7:00 PM',
      title: 'Evening Reflection Group',
      type: 'group',
      participants: 12,
      status: 'upcoming'
    }
  ]

  const quickActions = [
    {
      icon: '✏️',
      title: 'Daily Check-in',
      description: 'Share how you\'re feeling today',
      action: () => navigate('/checkin'),
      urgency: 'high'
    },
    {
      icon: '�',
      title: 'Find Meeting',
      description: 'Join a live support meeting',
      action: () => navigate('/meetings'),
      urgency: 'medium'
    },
    {
      icon: '�',
      title: 'Message Sponsor',
      description: 'Connect with your guide',
      action: () => navigate('/messages'),
      urgency: 'low'
    },
    {
      icon: '📚',
      title: 'Daily Reading',
      description: 'Today\'s reflection and wisdom',
      action: () => navigate('/readings'),
      urgency: 'medium'
    }
  ]

  const communityHighlights = [
    {
      author: 'Anonymous Friend',
      timeAgo: '2 hours ago',
      content: 'Hit 90 days today! This community has been my anchor. Thank you all for showing me what fellowship really means. 🙏',
      reactions: 24,
      type: 'milestone'
    },
    {
      author: 'Circle Member',
      timeAgo: '4 hours ago',
      content: 'Feeling grateful for tonight\'s group. Sometimes just knowing others understand makes all the difference.',
      reactions: 18,
      type: 'gratitude'
    },
    {
      author: 'Recovery Buddy',
      timeAgo: '6 hours ago',
      content: 'Struggling today but remembering what my sponsor said: "Progress, not perfection." Taking it one breath at a time.',
      reactions: 31,
      type: 'support'
    }
  ]

  const dailyQuote = "Fellowship is the great medicine for recovery. Together we can do what none of us could do alone."

  return (
    <div className={styles.homePage}>
      {/* Profile Completion Alert */}
      {needsProfileUpdate && (
        <AlertBar variation="notice" possibleToClose={true}>
          <p>
            Help us connect you with the right fellowship circles by completing your profile.&nbsp;&nbsp;
            <a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
              Complete Profile &nbsp;→
            </a>
          </p>
        </AlertBar>
      )}

      {/* Welcome Header */}
      <section className={styles.welcomeCard}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Welcome to your fellowship, {user?.first_name || user?.username || 'Friend'}
          </h1>
          <p className={styles.welcomeSubtitle}>
            Last active: {lastActive} • Your community is here for you
          </p>
        </div>
      </section>

      {/* Fellowship Stats */}
      <section className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>Your Fellowship Journey</h2>
        <div className={styles.statsGrid}>
          {fellowshipStats.map((stat, index) => (
            <div key={index} className={`${styles.statCard} ${styles[`stat-${stat.color}`]}`}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statTrend}>{stat.trend}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Take Action Today</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`${styles.actionCard} ${styles[`urgency-${action.urgency}`]}`}
              onClick={action.action}
            >
              <div className={styles.actionIcon}>{action.icon}</div>
              <div className={styles.actionContent}>
                <h3 className={styles.actionTitle}>{action.title}</h3>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Schedule */}
      <section className={styles.scheduleSection}>
        <h2 className={styles.sectionTitle}>Today's Fellowship</h2>
        <div className={styles.scheduleList}>
          {todaysActivities.map((activity, index) => (
            <div key={index} className={`${styles.scheduleItem} ${styles[`status-${activity.status}`]}`}>
              <div className={styles.scheduleTime}>{activity.time}</div>
              <div className={styles.scheduleContent}>
                <h3 className={styles.scheduleTitle}>{activity.title}</h3>
                <div className={styles.scheduleDetails}>
                  <span className={styles.scheduleType}>{activity.type}</span>
                  <span className={styles.scheduleParticipants}>
                    {activity.participants} {activity.participants === 1 ? 'person' : 'people'}
                  </span>
                </div>
              </div>
              <Button variant="tertiary" onPress={() => navigate('/meetings')}>
                Join
              </Button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--size-4)' }}>
          <Button variant="secondary" onPress={() => navigate('/meetings')}>
            View All Meetings
          </Button>
        </div>
      </section>

      {/* Community Highlights */}
      <section className={styles.communitySection}>
        <h2 className={styles.sectionTitle}>Fellowship Stories</h2>
        <p className={styles.sectionSubtitle}>What's happening in your community</p>
        <div className={styles.communityFeed}>
          {communityHighlights.map((post, index) => (
            <div key={index} className={`${styles.communityPost} ${styles[`type-${post.type}`]}`}>
              <div className={styles.postHeader}>
                <span className={styles.postAuthor}>{post.author}</span>
                <span className={styles.postTime}>{post.timeAgo}</span>
              </div>
              <p className={styles.postContent}>{post.content}</p>
              <div className={styles.postFooter}>
                <span className={styles.postReactions}>❤️ {post.reactions}</span>
                <Button variant="tertiary" onPress={() => navigate('/community')}>
                  Respond
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--size-4)' }}>
          <Button variant="secondary" onPress={() => navigate('/community')}>
            Join the Conversation
          </Button>
        </div>
      </section>

      {/* Daily Inspiration */}
      <section className={styles.encouragementFooter}>
        <div className={styles.encouragementContent}>
          <p className={styles.encouragementLabel}>Today's Fellowship Wisdom</p>
          <blockquote className={styles.dailyQuote}>
            "{dailyQuote}"
          </blockquote>
          <div className={styles.encouragementActions}>
            <Button
              variant="secondary"
              onPress={() => navigate('/checkin')}
              style={{ marginRight: 'var(--size-3)' }}
            >
              Share Your Reflection
            </Button>
            <Button
              variant="tertiary"
              onPress={() => navigate('/readings')}
            >
              More Wisdom
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
