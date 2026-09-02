import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from './Avatar';
import { Logo } from './Logo';
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
  onLogout?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'People', path: '/people' },
  { label: 'Opportunities', path: '/opportunities' },
  { label: 'Clubs', path: '/clubs' },
  { label: 'Genie', path: '/genie' },
];

export const NavBar: React.FC<NavBarProps> = ({
  user = { name: 'Pranav Bhat' },
  onLogout,
}) => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <header className={styles.navHeader}>
        <div className={styles.container}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo size={26} />
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

          {/* Top-Right Avatar Dropdown Menu */}
          <div className={styles.rightSection} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="User Avatar Menu"
            >
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  right: 0,
                  width: '200px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '6px 0',
                }}
                onClick={() => setDropdownOpen(false)}
              >
                <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '13px', fontWeight: 600 }}>
                  {user.name}
                </div>
                <Link to="/profile/me/edit" style={{ padding: '8px 16px', fontSize: '14px' }}>My Profile</Link>
                <Link to="/profile/me/edit" style={{ padding: '8px 16px', fontSize: '14px' }}>Privacy Settings</Link>
                <Link to="/connections" style={{ padding: '8px 16px', fontSize: '14px' }}>Connections</Link>
                <Link to="/saved" style={{ padding: '8px 16px', fontSize: '14px' }}>Saved Items</Link>
                <Link
                  to="/login"
                  style={{ padding: '8px 16px', fontSize: '14px', color: 'var(--warning-color)', borderTop: '1px solid var(--border-color)' }}
                  onClick={onLogout}
                >
                  Logout
                </Link>
              </div>
            )}
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
