import React from 'react';

export interface LogoProps {
  size?: number | string;
  showText?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({
  size = 28,
  showText = true,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        userSelect: 'none',
        textDecoration: 'none',
        ...style,
      }}
    >
      {/* Nano Banana / CampusOne Geometric Icon Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-label="CampusOne Logo Symbol"
      >
        {/* Outer C-Node Arc & Network Connections */}
        <path
          d="M 22 7 C 17.5 3.5 10.5 4 6.5 8.5 C 2.5 13 3 20 7.5 24 C 12 28 19 27.5 23 23"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Central Connecting Node & '1' Axis */}
        <line
          x1="16"
          y1="9"
          x2="16"
          y2="23"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 12 12 L 16 9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Connected Campus Nodes */}
        <circle cx="16" cy="9" r="2" fill="currentColor" />
        <circle cx="16" cy="23" r="2" fill="currentColor" />
        <circle cx="22" cy="7" r="2" fill="currentColor" />
        <circle cx="23" cy="23" r="2" fill="currentColor" />
        <circle cx="6.5" cy="8.5" r="2" fill="currentColor" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span
            style={{
              fontSize: '17px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
            }}
          >
            Campus<span style={{ color: 'var(--accent-color, #111111)' }}>One</span>
          </span>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary, #666666)',
              marginTop: '2px',
            }}
          >
            NMIT Bengaluru
          </span>
        </div>
      )}
    </div>
  );
};
