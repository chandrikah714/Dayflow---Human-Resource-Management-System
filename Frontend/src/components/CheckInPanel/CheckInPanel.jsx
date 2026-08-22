import GlowButton from '../GlowButton/GlowButton';
import './CheckInPanel.css';

export default function CheckInPanel({ checkInTime, checkOutTime, onCheckIn, onCheckOut, loading }) {
  const checkedIn = Boolean(checkInTime);
  const checkedOut = Boolean(checkOutTime);

  return (
    <section className="check-in-panel" aria-label="Attendance check-in">
      <div className="check-in-panel__row">
        <div className="check-in-panel__time">
          <span className="check-in-panel__label">Check in</span>
          <span className="check-in-panel__value">{checkInTime ?? '--:--'}</span>
        </div>
        <div className="check-in-panel__divider" aria-hidden="true" />
        <div className="check-in-panel__time">
          <span className="check-in-panel__label">Check out</span>
          <span className="check-in-panel__value">{checkOutTime ?? '--:--'}</span>
        </div>
      </div>

      <div className="check-in-panel__actions">
        <GlowButton
          variant="glow"
          tone="success"
          className="glow-btn--filled"
          disabled={loading || checkedIn}
          onClick={onCheckIn}
        >
          {loading && !checkedIn ? 'Checking in…' : 'Check in'}
        </GlowButton>
        <GlowButton
          variant="specular"
          tone="danger"
          disabled={loading || !checkedIn || checkedOut}
          onClick={onCheckOut}
        >
          {loading && checkedIn && !checkedOut ? 'Checking out…' : 'Check out'}
        </GlowButton>
      </div>
    </section>
  );
}
