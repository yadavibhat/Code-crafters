import React from 'react';
import { Button } from './Button';
import styles from './StateComponents.module.css';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try adjusting your search criteria or explore other options.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>{icon || '🔍'}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export interface LoadingStateProps {
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 2 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonSub}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonBody}`} />
        </div>
      ))}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to load content right now. Please try again.',
  onRetry,
}) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.iconWrapper} ${styles.warningIcon}`}>⚠️</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{message}</p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
