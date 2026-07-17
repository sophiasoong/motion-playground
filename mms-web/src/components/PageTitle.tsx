import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb';
import './PageTitle.css';

interface PageTitleAction {
  label: string;
  icon?: string;
  onClick?: () => void;
}

interface PageTitleProps {
  breadcrumbItems: BreadcrumbItem[];
  title: string;
  description?: string;
  action?: PageTitleAction;
}

export default function PageTitle({ breadcrumbItems, title, description, action }: PageTitleProps) {
  return (
    <div className="page-title">
      <Breadcrumb items={breadcrumbItems} />
      <div className="page-title__row">
        <h1 className="page-title__heading">{title}</h1>
        {action && (
          <button className="page-title__action" onClick={action.onClick}>
            {action.icon && (
              <span className="icon icon--sm" aria-hidden="true">{action.icon}</span>
            )}
            {action.label}
          </button>
        )}
      </div>
      {description && <p className="page-title__desc">{description}</p>}
    </div>
  );
}
