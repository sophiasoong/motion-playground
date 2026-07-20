import './Topbar.css';

interface TopbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Topbar({ sidebarCollapsed, onToggleSidebar }: TopbarProps) {
  return (
    <header className="topbar">
      {/* Brand logo — 260px, aligned with sidebar width. Dark by default, light when sidebar is collapsed */}
      <div className={`topbar__logo-area${sidebarCollapsed ? ' topbar__logo-area--light' : ''}`}>
        {sidebarCollapsed ? (
          <>
            <img src="/hktv-logo-round.svg" alt="" className="topbar__logo-icon" />
            <div className="topbar__logo-text">
              <img src="/mms-wordmark-merchant.svg" alt="Merchant" className="topbar__logo-title" />
              <img src="/mms-wordmark-subtitle.svg" alt="Management System" className="topbar__logo-subtitle" />
            </div>
          </>
        ) : (
          <img src="/mms-logo.png" alt="Merchant Management System" className="topbar__logo-img" />
        )}
      </div>

      <div className="topbar__main">
        {/* Left section */}
        <div className="topbar__left">
          {/* Sidebar toggle button */}
          <button
            className="topbar__menu-btn"
            aria-label="Toggle sidebar"
            aria-pressed={sidebarCollapsed}
            onClick={onToggleSidebar}
          >
            <span className="icon icon--sm">menu</span>
          </button>

          {/* Store selector */}
          <button className="topbar__store-btn" aria-haspopup="true">
            <span className="topbar__store-avatar" aria-hidden="true">
              <span className="icon icon--sm">storefront</span>
            </span>
            <span className="topbar__store-name">Store Name</span>
            <span className="topbar__store-dot" aria-hidden="true" />
            <span className="icon icon--sm topbar__chevron" aria-hidden="true">expand_more</span>
          </button>
        </div>

        {/* Search */}
        <div className="topbar__search">
          <input type="text" className="topbar__search-input" placeholder="Placeholder" />
          <span className="icon icon--lg topbar__search-icon" aria-hidden="true">search</span>
        </div>

        {/* Right section */}
        <div className="topbar__right">
          {/* Back to MMS */}
          <button className="topbar__back-btn">Back to MMS 1.0</button>

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
            <span className="icon icon--sm topbar__chevron" aria-hidden="true">expand_more</span>
          </button>

          {/* Divider */}
          <div className="topbar__divider" aria-hidden="true" />

          {/* User */}
          <button className="topbar__user-btn" aria-label="User menu">
            <span className="topbar__avatar" aria-hidden="true">
              <span className="icon icon--xs">person</span>
            </span>
            <span className="topbar__user-name">Serati Ma</span>
            <span className="icon icon--sm topbar__chevron" aria-hidden="true">expand_more</span>
          </button>
        </div>
      </div>
    </header>
  );
}
