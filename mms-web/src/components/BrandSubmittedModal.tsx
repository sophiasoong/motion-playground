import Dialog from './Dialog';
import './BrandSubmittedModal.css';

interface BrandSubmittedModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BrandSubmittedModal({ open, onClose }: BrandSubmittedModalProps) {
  return (
    <Dialog
      open={open}
      size="sm"
      title="Brand Submitted"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="brand-submitted-modal__btn brand-submitted-modal__btn--ghost"
            onClick={onClose}
          >
            Skip Now
          </button>
          <a
            className="brand-submitted-modal__btn brand-submitted-modal__btn--solid"
            href="https://cloud.marketing.hktvmall.com/HKTVmall_Zendesk_Cannotfindcorrectbrandcolorsizecategoryorigin_instructions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Submit Zendesk Webform
          </a>
        </>
      }
    >
      <p className="brand-submitted-modal__desc">
        Your brand has been created and is pending approval. Please remember to submit the
        Zendesk webform so our team can verify the brand details.
      </p>
    </Dialog>
  );
}
