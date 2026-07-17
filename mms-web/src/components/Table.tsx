import type { ReactNode } from 'react';
import { useDropdown } from './useDropdown';
import './Table.css';

export interface TableColumn<T> {
  /** Unique key; also used to read the raw value when no `render` is given */
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  emptyLabel?: string;
  resultsLabel?: string;
  /** Toolbar (search + filters) rendered inside the same card, above the results bar */
  toolbar?: ReactNode;
  /** Pagination — omit to render a static table with no footer */
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function Table<T>({
  columns,
  data,
  rowKey,
  emptyLabel = 'No results',
  resultsLabel,
  toolbar,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}: TableProps<T>) {
  const showPagination = !!(currentPage && totalPages && onPageChange);
  const pageSizeDropdown = useDropdown();

  return (
    <div className="table-card">
      {toolbar && <div className="table-card__toolbar">{toolbar}</div>}

      {resultsLabel && (
        <div className="table-card__results-bar">
          <span className="table-card__results-count">{resultsLabel}</span>
        </div>
      )}

      <div className="table-card__wrap">
        <table className="table">
          <thead>
            <tr className="table__thead-row">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="table__th"
                  style={{ width: col.width, textAlign: col.align ?? 'left' }}
                >
                  {col.header}
                  {col.sortable && (
                    <span className="icon icon--sm table__sort-icon" aria-hidden="true">swap_vert</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="table__empty" colSpan={columns.length}>{emptyLabel}</td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={rowKey(row, i)} className="table__tr">
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className="table__td"
                      style={{ textAlign: col.align ?? 'left' }}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="table-card__pagination">
          <button
            className="table-card__page-btn table-card__page-btn--nav"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => onPageChange!(Math.max(1, currentPage! - 1))}
          >
            <span className="icon icon--sm" aria-hidden="true">chevron_left</span>
          </button>
          {Array.from({ length: totalPages! }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`table-card__page-btn${currentPage === p ? ' table-card__page-btn--active' : ''}`}
              onClick={() => onPageChange!(p)}
              aria-current={currentPage === p ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className="table-card__page-btn table-card__page-btn--nav"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange!(Math.min(totalPages!, currentPage! + 1))}
          >
            <span className="icon icon--sm" aria-hidden="true">chevron_right</span>
          </button>

          {onPageSizeChange && (
            <div className="table-card__page-size" ref={pageSizeDropdown.ref}>
              <button
                type="button"
                className="table-card__page-size-trigger"
                onClick={() => pageSizeDropdown.setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={pageSizeDropdown.open}
                aria-label="Rows per page"
              >
                {pageSize} / page
                <span
                  className={`icon icon--xs table-card__page-size-chevron${pageSizeDropdown.open ? ' table-card__page-size-chevron--open' : ''}`}
                  aria-hidden="true"
                >
                  expand_more
                </span>
              </button>

              {pageSizeDropdown.open && (
                <ul className="table-card__page-size-panel" role="listbox">
                  {pageSizeOptions.map(size => (
                    <li key={size}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={size === pageSize}
                        className={`table-card__page-size-option${size === pageSize ? ' table-card__page-size-option--selected' : ''}`}
                        onClick={() => { onPageSizeChange(size); pageSizeDropdown.setOpen(false); }}
                      >
                        {size} / page
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
