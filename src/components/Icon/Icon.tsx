/**
 * Icon Component
 * Renders SVG icons by name with full type safety
 */

import * as Icons from 'assets/icons/icons';
import type { IconProps } from 'types';

const Icon = ({ name, className, ...props }: IconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    if (import.meta.env.DEV) {
      console.warn(`Icon "${name}" not found`);
    }
    return null;
  }

  return <IconComponent className={className} {...props} aria-hidden="true" />;
};

export default Icon;
