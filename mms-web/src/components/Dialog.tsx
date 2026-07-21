import type { ReactNode } from 'react';
import './Dialog.css';

interface DialogProps {
  open: boolean;
  size?: 'sm';
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}

export default function Dialog({ open, size = 'sm', title, onClose, children, footer }: DialogProps) {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className={`dialog dialog--${size}`}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
      >
        <div className="dialog__content">
          <p className="dialog__title">{title}</p>
          <div className="dialog__body">{children}</div>
        </div>
        <div className="dialog__footer">{footer}</div>
      </div>
    </div>
  );
}
