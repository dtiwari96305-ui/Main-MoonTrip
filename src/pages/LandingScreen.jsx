export const LandingScreen = ({ onDemo, onSignIn, onSignUp }) => {
  return (
    <div className="new-landing-root">
      <div className="new-landing-box">
        {/* Logo */}
        <div className="new-landing-logo">
          <img
            src="/assets/touridoo-logo.png"
            alt="Touridoo"
            className="new-landing-logo-img"
          />
          <span className="new-landing-logo-name">Touridoo</span>
        </div>

        {/* Headline */}
        <h1 className="new-landing-title">
          Manage your travel agency,<br />smarter.
        </h1>
        <p className="new-landing-subtitle">
          Quotes, bookings, payments and invoices — all in one place.
        </p>

        {/* Primary CTA */}
        <button className="new-landing-btn-primary" onClick={onSignIn}>
          Sign In
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        {/* Secondary CTA */}
        <button className="new-landing-btn-secondary" onClick={onDemo}>
          View Demo
        </button>

        {/* Create account link */}
        <p className="new-landing-create">
          New here?{' '}
          <span className="new-landing-link" onClick={onSignUp}>
            Create account
          </span>
        </p>
      </div>
    </div>
  );
};
