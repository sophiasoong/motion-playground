import './Topbar.css';

export default function Topbar() {
  return (
    <header className="topbar">
      {/* Brand logo — 260px, aligned with sidebar width */}
      <div className="topbar__logo-area">
        <img src="/mms-logo.png" alt="Merchant Management System" className="topbar__logo-img" />
      </div>

      {/* Sidebar toggle button */}
      <button className="topbar__menu-btn" aria-label="Toggle sidebar">
        <span className="icon icon--sm">menu</span>
      </button>

      {/* Right section */}
      <div className="topbar__right">
        {/* Back to MMS */}
        <button className="topbar__back-btn">Back to MMS</button>

        {/* Help */}
        <button className="topbar__icon-btn" aria-label="Help">
          <span className="icon">help</span>
        </button>

        {/* Notifications */}
        <div className="topbar__notif-wrap">
          <button className="topbar__icon-btn" aria-label="Notifications">
            <span className="icon">notifications</span>
          </button>
          <span className="topbar__badge">99+</span>
        </div>

        {/* Language selector */}
        <button className="topbar__lang-btn" aria-label="Language">
          English
          <img src="/icon-down.png" alt="" className="topbar__chevron" />
        </button>

        {/* Divider */}
        <div className="topbar__divider" aria-hidden="true" />

        {/* User */}
        <button className="topbar__user-btn" aria-label="User menu">
          <img src="/merchant-avatar.png" alt="" className="topbar__avatar" />
          <span className="topbar__user-name">Serati Ma</span>
          <img src="/icon-down.png" alt="" className="topbar__chevron" />
        </button>
      </div>
    </header>
  );
}
