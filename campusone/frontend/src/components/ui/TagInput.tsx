import React, { useState } from 'react';
import { Badge } from './Badge';
import styles from './Form.module.css';

export interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter...',
  error,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className={styles.fieldWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.tagInputContainer}>
        {tags.map((tag) => (
          <Badge key={tag} variant="accent">
            {tag}
            <button
              type="button"
              className={styles.tagRemoveBtn}
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </Badge>
        ))}
        <input
          type="text"
          className={styles.tagInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
