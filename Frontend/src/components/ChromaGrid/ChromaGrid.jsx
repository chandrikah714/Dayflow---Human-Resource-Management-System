import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

// Status → dot color mapping, per the attendance wireframe:
// green = present, amber = on leave, red = absent (no time off applied).
const STATUS_META = {
  present: { label: 'Present', className: 'status-present' },
  leave: { label: 'On leave', className: 'status-leave' },
  absent: { label: 'Absent', className: 'status-absent' },
};

/**
 * items: [{ id, image, title, subtitle, handle, borderColor, gradient, status, onSelect }]
 * radius/damping/fadeOut/ease mirror the reactbits ChromaGrid API from the brief.
 */
export default function ChromaGrid({
  items = [],
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
}) {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');

    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = useCallback(
    (x, y) => {
      gsap.to(pos.current, {
        x,
        y,
        duration: damping,
        ease,
        onUpdate: () => {
          setX.current?.(pos.current.x);
          setY.current?.(pos.current.y);
        },
        overwrite: true,
      });
    },
    [damping, ease],
  );

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardMove = (e) => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  if (items.length === 0) {
    return (
      <div className="chroma-empty">
        <p>No records to show yet.</p>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{ '--r': `${radius}px` }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      role="list"
    >
      {items.map((item, i) => {
        const status = item.status ? STATUS_META[item.status] : null;
        const Card = (
          <>
            <div className="chroma-img-wrapper">
              {item.image ? (
                <img src={item.image} alt="" loading="lazy" />
              ) : (
                <div className="chroma-img-fallback" aria-hidden="true">
                  {item.title?.[0] ?? '?'}
                </div>
              )}
              {status && (
                <span
                  className={`chroma-status-dot ${status.className}`}
                  title={status.label}
                  aria-label={status.label}
                />
              )}
            </div>
            <div className="chroma-info">
              <div>
                <p className="chroma-name">{item.title}</p>
                {item.subtitle && <p className="role">{item.subtitle}</p>}
              </div>
              {item.handle && <span className="handle">{item.handle}</span>}
            </div>
          </>
        );

        const cardProps = {
          className: 'chroma-card',
          style: {
            '--card-border': item.borderColor || 'var(--brand)',
            '--card-gradient': item.gradient || 'var(--surface-raised)',
            '--spotlight-color': 'var(--spotlight)',
          },
          onMouseMove: handleCardMove,
          role: 'listitem',
        };

        // Cards are keyboard-focusable and Enter/click-activatable — the
        // wireframe calls for these to open an employee's profile.
        return item.onSelect ? (
          <button
            key={item.id ?? i}
            type="button"
            {...cardProps}
            onClick={() => item.onSelect(item)}
          >
            {Card}
          </button>
        ) : (
          <div key={item.id ?? i} {...cardProps} tabIndex={0}>
            {Card}
          </div>
        );
      })}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
}
