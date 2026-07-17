import './Breadcrumb.css';

export interface BreadcrumbItem {
  /** Visible label for this crumb */
  label: string;
  /** Optional navigation target; omit for the active (last) crumb */
  href?: string;
  /** Click handler for SPA navigation */
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isActive = i === items.length - 1;
        return (
          <span key={i} className="breadcrumb__item-group" style={{ display: 'contents' }}>
            {i > 0 && (
              <span className="breadcrumb__sep" aria-hidden="true">/</span>
            )}
            {isActive ? (
              <span className="breadcrumb__crumb breadcrumb__crumb--active">{item.label}</span>
            ) : (
              <span
                className="breadcrumb__crumb breadcrumb__crumb--link"
                onClick={item.onClick}
                role={item.href || item.onClick ? 'link' : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
