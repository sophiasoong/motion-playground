import { useState } from 'react';
import './OverviewPage.css';
import Breadcrumb from './Breadcrumb';

/* ── Data ────────────────────────────────────────────────────────── */

type EnrollmentStatus = 'open' | 'pending-confirm' | 'confirmed' | 'opted-out' | 'exit-scheduled';

interface Cycle {
  id: string;
  storefrontCode: string;
  startDate: string;
  endDate: string;
  status: EnrollmentStatus;
}

const MOCK_CYCLES: Cycle[] = [
  { id: 'PPP-2026-0003', storefrontCode: 'H2748138', startDate: '2026-04-01', endDate: '2026-04-30', status: 'pending-confirm' },
  { id: 'PPP-2026-0002', storefrontCode: 'H2748138', startDate: '2026-03-01', endDate: '2026-03-31', status: 'confirmed' },
  { id: 'PPP-2026-0001', storefrontCode: 'H3912847', startDate: '2026-02-01', endDate: '2026-02-28', status: 'open' },
  { id: 'PPP-2025-0012', storefrontCode: 'H3912847', startDate: '2025-12-01', endDate: '2025-12-31', status: 'opted-out' },
  { id: 'PPP-2025-0011', storefrontCode: 'H4839201', startDate: '2025-11-01', endDate: '2025-11-30', status: 'exit-scheduled' },
];

const STATUS_CONFIG: Record<EnrollmentStatus, { label: string; dotClass: string; actionLabel: string }> = {
  'open':           { label: 'Open',            dotClass: 'dot--success', actionLabel: 'Enroll' },
  'pending-confirm':{ label: 'Pending Confirm', dotClass: 'dot--warning', actionLabel: 'Confirm' },
  'confirmed':      { label: 'Confirmed',       dotClass: 'dot--info',    actionLabel: 'View SKU' },
  'opted-out':      { label: 'Opted Out',       dotClass: 'dot--neutral', actionLabel: 'View Log' },
  'exit-scheduled': { label: 'Exit Scheduled',  dotClass: 'dot--neutral', actionLabel: 'View Log' },
};

const FILTER_CHIPS = ['Storefront Code', 'Promotion Date', 'Enrollment Status', 'Cycle'];

/* ── Component ───────────────────────────────────────────────────── */

export default function OverviewPage() {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 5;

  return (
    <main className="overview">

      {/* ── Page heading ── */}
      <div className="overview__heading-block">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Promotion Management' },
          { label: 'Personal Price Promotion' },
          { label: 'Program Cycles' },
        ]} />

        <h1 className="overview__title">Personal Price Promotion</h1>

        <p className="overview__desc">
          Personal Price Promotion (PPP) offers personalised discounts to targeted customers
          based on their shopping behaviour. Enrolled merchants participate in monthly promotion
          cycles — review your eligible SKUs, set PPP prices, and confirm your SKU list before
          each cycle's deadline.
        </p>
      </div>

      {/* ── Main card ── */}
      <div className="overview__card">

        {/* Toolbar */}
        <div className="overview__toolbar">
          {FILTER_CHIPS.map(chip => (
            <button key={chip} className="promo-chip">
              {chip}
              <span className="icon icon--sm" aria-hidden="true">expand_more</span>
            </button>
          ))}
        </div>

        {/* Results bar */}
        <div className="overview__results-bar">
          <span className="overview__results-count">1–{MOCK_CYCLES.length} of {MOCK_CYCLES.length} results</span>
        </div>

        {/* Table */}
        <div className="overview__table-wrap">
          <table className="overview__table">
            <thead>
              <tr className="overview__thead-row">
                {['Promotion ID', 'Storefront Code', 'Promotion Start Date', 'Promotion End Date', 'Enrollment Status'].map(col => (
                  <th key={col} className="overview__th">
                    {col}
                    <span className="icon icon--sm overview__sort-icon" aria-hidden="true">swap_vert</span>
                  </th>
                ))}
                <th className="overview__th overview__th--action">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CYCLES.map((row, idx) => {
                const cfg = STATUS_CONFIG[row.status];
                return (
                  <tr key={row.id + row.storefrontCode} className={`overview__tr${idx < 3 ? ' overview__tr--highlighted' : ''}`}>
                    <td className="overview__td">{row.id}</td>
                    <td className="overview__td">{row.storefrontCode}</td>
                    <td className="overview__td">{row.startDate}</td>
                    <td className="overview__td">{row.endDate}</td>
                    <td className="overview__td">
                      <span className="status-dot-badge">
                        <span className={`status-dot ${cfg.dotClass}`} aria-hidden="true" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="overview__td overview__td--action">
                      <button className="overview__action-btn">{cfg.actionLabel}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="overview__pagination">
          <button
            className="overview__page-btn overview__page-btn--nav"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <span className="icon icon--sm" aria-hidden="true">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`overview__page-btn${currentPage === p ? ' overview__page-btn--active' : ''}`}
              onClick={() => setCurrentPage(p)}
              aria-current={currentPage === p ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className="overview__page-btn overview__page-btn--nav"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <span className="icon icon--sm" aria-hidden="true">chevron_right</span>
          </button>
          <select className="overview__page-size" aria-label="Rows per page">
            <option>10 / page</option>
            <option>25 / page</option>
            <option>50 / page</option>
          </select>
          <span className="overview__goto-label">Go to</span>
          <input className="overview__goto-input" type="number" min={1} max={totalPages} aria-label="Go to page" />
        </div>

      </div>
    </main>
  );
}
