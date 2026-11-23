import React from 'react';

/**
 * Pixel-perfect official tech stack SVG icons and gamification badges
 */
export const TechIcon = ({ name, className = 'w-5 h-5' }) => {
  const norm = (name || '').toLowerCase();

  if (norm.includes('react')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  if (norm.includes('javascript') || norm === 'js') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect width="24" height="24" rx="4" fill="#f7df1e" />
        <path
          d="M6.5 17.5v-3.8h2.3v3.8c0 1.5-.7 2.2-2.1 2.2-1.3 0-2-.6-2.2-1.8l1.9-.4c.1.5.4.8.8.8.4 0 .7-.2.7-.6zm7.2 2.1c-1.3 0-2.3-.6-2.7-1.7l1.9-.7c.3.6.6.9 1.1.9.5 0 .8-.2.8-.5 0-.4-.3-.6-1-.8l-.8-.3c-1.2-.4-1.8-1.1-1.8-2.1 0-1.4 1.1-2.2 2.6-2.2 1.2 0 2 .5 2.4 1.4l-1.8.8c-.2-.5-.5-.7-.9-.7-.4 0-.7.2-.7.5 0 .3.2.5.8.7l.8.3c1.4.5 2 1.2 2 2.3-.1 1.4-1.1 2.2-2.7 2.2z"
          fill="#000"
        />
      </svg>
    );
  }

  if (norm.includes('python')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M11.9 2c-3.1 0-5.1.7-5.1 2.8v2.1h5.3v.7H4.3C2.1 7.6 1 9.4 1 12.3c0 3 1.2 4.7 3.3 4.7h1.9v-2.3c0-2.2 1.8-4 4.1-4h5.2c.7 0 1.3-.6 1.3-1.3V4.8c0-2.1-2-2.8-4.9-2.8zm-2.4 1.7c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
          fill="#387eb8"
        />
        <path
          d="M12.1 22c3.1 0 5.1-.7 5.1-2.8v-2.1h-5.3v-.7h7.8c2.2 0 3.3-1.8 3.3-4.7 0-3-1.2-4.7-3.3-4.7h-1.9v2.3c0 2.2-1.8 4-4.1 4H8.5c-.7 0-1.3.6-1.3 1.3v4.6c0 2.1 2 2.8 4.9 2.8zm2.4-1.7c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
          fill="#ffe052"
        />
      </svg>
    );
  }

  if (norm.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 6c-3 0-5.5 1.5-6.5 4.5 1.5-1.5 3.5-1.8 5-1 1.7.9 2.7 2.5 4 4.5 2 3.1 4.5 5 7.5 5 3 0 5.5-1.5 6.5-4.5-1.5 1.5-3.5 1.8-5 1-1.7-.9-2.7-2.5-4-4.5-2-3.1-4.5-5-7.5-5zm-8 7c-3 0-5.5 1.5-6.5 4.5 1.5-1.5 3.5-1.8 5-1 1.7.9 2.7 2.5 4 4.5 2 3.1 4.5 5 7.5 5 3 0 5.5-1.5 6.5-4.5-1.5 1.5-3.5 1.8-5 1-1.7-.9-2.7-2.5-4-4.5-2-3.1-4.5-5-7.5-5z"
          fill="#38bdf8"
        />
      </svg>
    );
  }

  if (norm.includes('css')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.5 2.5l1.7 19 7.8 2.2 7.8-2.2 1.7-19H2.5zm15.4 5.3l-.3 3.3h-8l.3 3.3h7.4l-.6 6.3-4.7 1.3-4.7-1.3-.3-3.6h2.8l.2 1.7 2 .5 2-.5.3-2.6H6.3l-.7-8.8h12.3z" fill="#2965f1" />
      </svg>
    );
  }

  if (norm.includes('mern') || norm.includes('node')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8L12 11.8 5.2 8 12 4.2zm-7 5.1l6 3.4v6.8l-6-3.4V9.3zm8 10.2v-6.8l6-3.4v6.8l-6 3.4z" fill="#10b981" />
      </svg>
    );
  }

  // Default fallback code icon
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
};

export const TrophyIcon = ({ className = 'w-5 h-5 text-amber-400' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
  </svg>
);

export const FlameIcon = ({ className = 'w-5 h-5 text-rose-500' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM12 20c-3.31 0-6-2.69-6-6 0-1.53.58-2.96 1.57-4.06.49 1.48 1.88 2.56 3.53 2.56 1.86 0 3.41-1.35 3.74-3.13C16.88 10.82 18 12.3 18 14c0 3.31-2.69 6-6 6z" />
  </svg>
);

export const SoundIcon = ({ muted, className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    {muted ? (
      <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .68.69 1.17 1.33.91.8-.32 1.53-.76 2.2-1.31l1.45 1.45a.996.996 0 101.41-1.41L5.05 3.63a.996.996 0 00-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76zm4.5 8c0-.71-.13-1.38-.36-2l1.62-1.62c.47 1.07.74 2.27.74 3.62z" />
    ) : (
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    )}
  </svg>
);
