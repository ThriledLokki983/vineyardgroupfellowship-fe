/**
 * ReactionBar Component
 * Displays and manages reactions for discussions and feed items
 */

import { useState } from 'react';
import { Button } from 'react-aria-components';
import { useReactions, useToggleReaction } from '../../hooks/messaging';
import type { ReactionType, Reaction } from '../../types/messaging';
import styles from './ReactionBar.module.scss';

interface ReactionBarProps {
  discussionId: string;
  currentUserId: string;
  initialCounts?: Record<ReactionType, number>;
  compact?: boolean;
}

const REACTION_ICONS: Record<ReactionType, { icon: string; label: string }> = {
  like: { icon: '👍', label: 'Like' },
  love: { icon: '❤️', label: 'Love' },
  pray: { icon: '🙏', label: 'Praying' },
  amen: { icon: '🙌', label: 'Amen' },
};

export const ReactionBar: React.FC<ReactionBarProps> = ({
  discussionId,
  currentUserId,
  initialCounts,
  compact = false,
}) => {
  const { data: reactionsData } = useReactions(discussionId);
  const { toggle, isPending } = useToggleReaction();
  const [optimisticReaction, setOptimisticReaction] = useState<ReactionType | null>(null);

  // Calculate reaction counts and current user's reaction
  const reactionCounts: Record<ReactionType, number> = {
    like: 0,
    love: 0,
    pray: 0,
    amen: 0,
    ...initialCounts,
  };

  let userReaction: { id: string; type: ReactionType } | null = null;

  if (reactionsData?.results) {
    reactionsData.results.forEach((reaction) => {
      const type = reaction.reaction_type;
      reactionCounts[type]++;

      // Check if this is the current user's reaction
      const userId = typeof reaction.user === 'string' ? reaction.user : reaction.user.id;
      if (userId === currentUserId) {
        userReaction = { id: reaction.id, type };
      }
    });
  }

  const handleReactionClick = async (type: ReactionType) => {
    if (isPending) return;

    setOptimisticReaction(type);

    try {
      const existingReaction: Reaction | undefined =
        userReaction?.type === type
          ? ({
              id: userReaction.id,
              discussion: discussionId,
              reaction_type: type,
              user: currentUserId,
              created_at: new Date().toISOString(),
            } as Reaction)
          : undefined;

      await toggle({
        discussionId,
        reactionType: type,
        existingReaction,
      });
    } finally {
      setOptimisticReaction(null);
    }
  };

  return (
    <div className={`${styles.reactionBar} ${compact ? styles.compact : ''}`}>
      {(Object.entries(REACTION_ICONS) as [ReactionType, typeof REACTION_ICONS[ReactionType]][]).map(
        ([type, { icon, label }]) => {
          const count = reactionCounts[type];
          const isActive = userReaction?.type === type;
          const isOptimistic = optimisticReaction === type;

          return (
            <Button
              key={type}
              className={`${styles.reactionButton} ${isActive ? styles.active : ''} ${
                isOptimistic ? styles.pending : ''
              }`}
              onPress={() => handleReactionClick(type)}
              isDisabled={isPending}
              aria-label={`${label} reaction${count > 0 ? `, ${count} total` : ''}`}
            >
              <span className={styles.icon}>{icon}</span>
              {count > 0 && <span className={styles.count}>{count}</span>}
            </Button>
          );
        }
      )}
    </div>
  );
};

export default ReactionBar;
