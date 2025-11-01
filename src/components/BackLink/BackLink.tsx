import { Link, type To } from 'react-router-dom';
import { Icon } from '..';
import styles from './BackLink.module.scss';

interface BackLinkProps {
  to?: To | number;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const BackLink = ({
  to = -1,
  children,
  onClick,
  ...props
}: BackLinkProps) => {

  return (
    <nav className={styles.root} back-link="" {...props}>
      <Link to={to as To} onClick={onClick}>
        <Icon name="ArrowLeftIcon" aria-hidden="true" />
        <span>{children}</span>
      </Link>
    </nav>
  );

};

export default BackLink;
