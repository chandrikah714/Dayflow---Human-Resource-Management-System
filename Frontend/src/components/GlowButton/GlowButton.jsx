import { useRef } from 'react';
import './GlowButton.css';

/**
 * variant: 'glow' (animated border-glow ring) | 'specular' (cursor-tracked
 * highlight sweep) | 'ghost' (quiet, no effect — for tertiary actions)
 * tone: 'brand' | 'success' | 'danger'  (e.g. Approve = success, Reject = danger)
 */
export default function GlowButton({
  children,
  variant = 'glow',
  tone = 'brand',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  const ref = useRef(null);

  const handlePointerMove = (e) => {
    if (variant !== 'specular' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--gx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--gy', `${e.clientY - rect.top}px`);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      className={`glow-btn glow-btn--${variant} glow-btn--${tone} ${className}`}
      {...rest}
    >
      <span className="glow-btn__label">{children}</span>
    </button>
  );
}
