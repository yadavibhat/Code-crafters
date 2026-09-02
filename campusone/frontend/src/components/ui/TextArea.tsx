import React from 'react';
import styles from './Form.module.css';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const textAreaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={styles.fieldWrapper}>
      {label && (
        <label htmlFor={textAreaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea id={textAreaId} className={`${styles.textarea} ${className}`} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
