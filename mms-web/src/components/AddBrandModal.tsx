import { useState } from 'react';
import Modal from './Modal';
import './AddBrandModal.css';

interface AddBrandModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (brand: { nameEn: string; nameZh: string; nameZhSimpl: string }) => void;
}

export default function AddBrandModal({ open, onClose, onSubmit }: AddBrandModalProps) {
  const [nameEn, setNameEn] = useState('');
  const [nameZh, setNameZh] = useState('');
  const [nameZhSimpl, setNameZhSimpl] = useState('');
  const [nameEnError, setNameEnError] = useState(false);

  const handleClose = () => {
    setNameEn('');
    setNameZh('');
    setNameZhSimpl('');
    setNameEnError(false);
    onClose();
  };

  const handleNameEnChange = (value: string) => {
    setNameEn(value);
    if (nameEnError && value.trim()) setNameEnError(false);
  };

  const handleSubmit = () => {
    if (!nameEn.trim()) {
      setNameEnError(true);
      return;
    }
    onSubmit({ nameEn, nameZh, nameZhSimpl });
    handleClose();
  };

  return (
    <Modal
      open={open}
      size="sm"
      title="Add Brand"
      onClose={handleClose}
      footer={
        <>
          <button type="button" className="add-brand-modal__btn add-brand-modal__btn--outline" onClick={handleClose}>
            Cancel
          </button>
          <button type="button" className="add-brand-modal__btn add-brand-modal__btn--solid" onClick={handleSubmit}>
            Submit
          </button>
        </>
      }
    >
      <div className="add-brand-modal__field">
        <label className="add-brand-modal__label" htmlFor="add-brand-code">
          Brand Code<span className="add-brand-modal__required" aria-hidden="true">*</span>
        </label>
        <input
          id="add-brand-code"
          className="add-brand-modal__input"
          type="text"
          value=""
          disabled
          placeholder="Auto-generated from English name"
          readOnly
        />
      </div>

      <div className="add-brand-modal__field">
        <label className="add-brand-modal__label" htmlFor="add-brand-name-en">
          Brand Name (in English)<span className="add-brand-modal__required" aria-hidden="true">*</span>
        </label>
        <input
          id="add-brand-name-en"
          className={`add-brand-modal__input${nameEnError ? ' add-brand-modal__input--error' : ''}`}
          type="text"
          value={nameEn}
          onChange={e => handleNameEnChange(e.target.value)}
          placeholder="Enter English name"
          aria-invalid={nameEnError}
          aria-describedby={nameEnError ? 'add-brand-name-en-error' : undefined}
        />
        {nameEnError && (
          <p className="add-brand-modal__error-text" id="add-brand-name-en-error">
            This field is required
          </p>
        )}
      </div>

      <div className="add-brand-modal__field">
        <label className="add-brand-modal__label" htmlFor="add-brand-name-zh">
          Brand Name (in Traditional Chinese)
        </label>
        <input
          id="add-brand-name-zh"
          className="add-brand-modal__input"
          type="text"
          value={nameZh}
          onChange={e => setNameZh(e.target.value)}
          placeholder="輸入繁體中文名稱"
        />
      </div>

      <div className="add-brand-modal__field">
        <label className="add-brand-modal__label" htmlFor="add-brand-name-zh-simpl">
          Brand Name (in Simplified Chinese)
        </label>
        <input
          id="add-brand-name-zh-simpl"
          className="add-brand-modal__input"
          type="text"
          value={nameZhSimpl}
          onChange={e => setNameZhSimpl(e.target.value)}
          placeholder="输入简体中文名称"
        />
      </div>
    </Modal>
  );
}
