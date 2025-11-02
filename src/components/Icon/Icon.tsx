import * as Icons from 'assets/icons/icons';
import type { FC, SVGProps } from 'react';
import type { IconProps } from 'types';

const Icon = ({ name, className, ...props }: IconProps) => {
  const IconComponent = Icons[name as keyof typeof Icons] as FC<SVGProps<SVGSVGElement>>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} {...props} aria-hidden="true" />;
};

export default Icon;
