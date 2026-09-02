import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from './Avatar';
import styles from './NavBar.module.css';

export interface NavItem {
  label: string;
  path: string;
}

export interface NavBarProps {
  user?: {
    name: string;
    avatarUrl?: string;
  };
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'People', path: '/people' },
  { label: 'Opportunities', path: '/opportunities' },
  { label: 'Clubs', path: '/clubs' },
  { label: 'Genie', path: '/genie' },
];

export const NavBar: React.FC<NavBarProps> = ({
  user = { name: 'Aditya Rao' },
}) => {
  const location = useLocation();

  return (
    <>
      <header className={styles.navHeader}>
        <div className={styles.container}>
          <Link to="/" className={styles.brand}>
            <span>Campus</span>
            <span className={styles.brandAccent}>One</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.rightSection}>
            <Link to="/profile/me/edit" title="My Profile">
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile Navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.mobileNavLink} ${isActive ? styles.mobileActiveLink : ''}`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
