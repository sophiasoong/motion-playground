import type { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  open: boolean;
  size?: 'sm';
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}

export default function Modal({ open, size = 'sm', title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal__header">
          <p className="modal__title">{title}</p>
          <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
            <span className="icon icon--sm" aria-hidden="true">close</span>
          </button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">{footer}</div>
      </div>
    </div>
  );
}
