import { Link, useNavigate } from 'react-router-dom';
import { startTransition } from 'react';
import type { LinkProps } from 'react-router-dom';
import type { MouseEvent } from 'react';

/**
 * Link component that uses the View Transition API when available,
 * wrapped in React's startTransition for proper React scheduling
 *
 * NOTE: View Transitions are currently DISABLED for better performance
 */
export default function ViewTransitionLink({ to, onClick, ...props }: LinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Skip if default prevented or modified click
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) {
      return;
    }

    e.preventDefault();

    // TRANSITIONS DISABLED: Using standard navigation without View Transition API
    // This provides instant page transitions for better performance

    // Use React's startTransition for proper scheduling
    startTransition(() => {
      navigate(to as string);
    });
  };

  return <Link to={to} onClick={handleClick} {...props} />;
}
