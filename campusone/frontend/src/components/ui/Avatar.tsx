import React, { useState } from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const classNames = [styles.avatar, styles[size], className].filter(Boolean).join(' ');

  const initials = getInitials(name);

  return (
    <div className={classNames} title={name}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          className={styles.img}
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
