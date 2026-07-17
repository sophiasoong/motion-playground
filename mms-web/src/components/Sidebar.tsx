import { useState, useEffect, useRef } from 'react';
import './Sidebar.css';

interface FlyoutItem {
  id: string;
  label: string;
}

interface NavItem {
  id: string;
  icon: string;
  label: string;
  flyoutItems?: FlyoutItem[];
}

interface Section {
  id: string;
  title: string;
  items: NavItem[];
}

const SECTIONS: Section[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      { id: 'order-management',   icon: 'receipt_long',      label: 'Order Management' },
      { id: 'product-inventory',  icon: 'inventory_2',       label: 'Product and Inventory' },
      { id: 'merchant-dashboard', icon: 'dashboard',         label: 'Merchant Dashboard' },
      { id: 'merchant-ad',        icon: 'campaign',          label: 'Merchant Advertisement' },
      { id: 'payment-center',     icon: 'payments',          label: 'Payment Center' },
      { id: 'ratings-reviews',    icon: 'star',              label: 'Ratings and Reviews' },
      { id: 'merchant',           icon: 'storefront',        label: 'Merchant' },
      { id: 'system',             icon: 'settings',          label: 'System' },
    ],
  },
  {
    id: 'platform-support',
    title: 'Platform Support',
    items: [
      { id: 'return-request', icon: 'assignment_return', label: 'Return Request' },
    ],
  },
  {
    id: 'hktv',
    title: 'HKTVmall',
    items: [
      { id: 'hktv-store', icon: 'store',          label: 'Store Management' },
      { id: 'hktv-3pl',   icon: 'local_shipping', label: '3PL' },
      {
        id: 'hktv-promo',
        icon: 'local_offer',
        label: 'Promotion Management',
        flyoutItems: [
          { id: 'promo-voucher', label: 'Voucher Campaigns' },
          { id: 'promo-flash',   label: 'Flash Sales' },
          { id: 'promo-coupon',  label: 'Coupon Codes' },
        ],
      },
    ],
  },
  {
    id: 'theplace',
    title: 'ThePlace',
    items: [
      { id: 'theplace-store', icon: 'store', label: 'Store Management' },
    ],
  },
];

interface FlyoutState {
  id: string;
  top: number;
  items: FlyoutItem[];
  label: string;
}

export default function Sidebar() {
  const [activeId, setActiveId] = useState('order-management');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    main: true,
    'platform-support': true,
    hktv: true,
    theplace: true,
  });
  const [flyout, setFlyout] = useState<FlyoutState | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  function toggleSection(id: string) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleItemClick(item: NavItem, e: React.MouseEvent<HTMLButtonElement>) {
    if (item.flyoutItems) {
      if (flyout?.id === item.id) {
        setFlyout(null);
      } else {
        const rect = e.currentTarget.getBoundingClientRect();
        setFlyout({ id: item.id, top: rect.top, items: item.flyoutItems, label: item.label });
      }
    } else {
      setActiveId(item.id);
      setFlyout(null);
    }
  }

  useEffect(() => {
    if (!flyout) return;
    function onPointerDown(e: PointerEvent) {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setFlyout(null);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [flyout]);

  useEffect(() => {
    if (!flyout) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setFlyout(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [flyout]);

  return (
    <>
      <aside className="sidebar">
        {SECTIONS.map(section => (
          <div key={section.id} className="sidebar__section">
            <button
              className="sidebar__section-header"
              onClick={() => toggleSection(section.id)}
              aria-expanded={expanded[section.id]}
            >
              <span className="sidebar__section-title">{section.title}</span>
              <span
                className={`icon icon--sm sidebar__chevron${expanded[section.id] ? ' sidebar__chevron--up' : ''}`}
                aria-hidden="true"
              >
                expand_more
              </span>
            </button>

            {expanded[section.id] && (
              <div className="sidebar__item-indent">
                <ul className="sidebar__item-list" role="list">
                  {section.items.map(item => (
                    <li key={item.id}>
                      <button
                        className={`sidebar__item${
                          activeId === item.id || flyout?.id === item.id
                            ? ' sidebar__item--active'
                            : ''
                        }`}
                        onClick={e => handleItemClick(item, e)}
                        aria-haspopup={item.flyoutItems ? 'true' : undefined}
                        aria-expanded={item.flyoutItems ? flyout?.id === item.id : undefined}
                      >
                        <span
                          className={`icon sidebar__item-icon${activeId === item.id ? ' icon--filled' : ''}`}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                        <span className="sidebar__item-label">{item.label}</span>
                        <span className="icon icon--xs sidebar__item-chevron" aria-hidden="true">
                          chevron_right
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </aside>

      {flyout && (
        <div
          ref={flyoutRef}
          className="sidebar-flyout"
          style={{ top: flyout.top }}
          role="menu"
          aria-label={flyout.label}
        >
          <p className="sidebar-flyout__heading">{flyout.label}</p>
          <ul className="sidebar-flyout__list" role="list">
            {flyout.items.map(sub => (
              <li key={sub.id}>
                <button
                  className={`sidebar-flyout__item${activeId === sub.id ? ' sidebar-flyout__item--active' : ''}`}
                  role="menuitem"
                  onClick={() => {
                    setActiveId(sub.id);
                    setFlyout(null);
                  }}
                >
                  {sub.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
