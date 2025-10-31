import * as Icons from 'assets/icons/icons';
import type { FC, SVGProps } from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof Icons;
  className?: string;
}

const Icon = ({ name, className, ...props }: IconProps) => {
  const IconComponent = Icons[name] as FC<SVGProps<SVGSVGElement>>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} {...props} aria-hidden="true" />;
};

export default Icon;
