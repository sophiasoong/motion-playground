import Modal from './Modal';
import './BrandSubmittedModal.css';

interface BrandSubmittedModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BrandSubmittedModal({ open, onClose }: BrandSubmittedModalProps) {
  return (
    <Modal
      open={open}
      size="sm"
      title="Brand Submitted"
      onClose={onClose}
      footer={
        <button type="button" className="brand-submitted-modal__btn" onClick={onClose}>
          Got it
        </button>
      }
    >
      <p className="brand-submitted-modal__desc">
        Your brand has been created and is pending approval. Please remember to submit the
        Zendesk webform so our team can verify the brand details.
      </p>
      <a
        className="brand-submitted-modal__link"
        href="https://cloud.marketing.hktvmall.com/HKTVmall_Zendesk_Cannotfindcorrectbrandcolorsizecategoryorigin_instructions/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Submit Zendesk Webform
        <span className="icon icon--sm" aria-hidden="true">open_in_new</span>
      </a>
    </Modal>
  );
}
