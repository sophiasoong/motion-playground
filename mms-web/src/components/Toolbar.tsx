import { useDropdown } from './useDropdown';
import './Toolbar.css';

export interface ToolbarOption {
  value: string;
  label: string;
}

interface ToolbarProps {
  scopeOptions: ToolbarOption[];
  scope: string;
  onScopeChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  chipOptions: ToolbarOption[];
  chipLabel: string;
  chipValue: string;
  onChipChange: (value: string) => void;
  onReset: () => void;
}

export default function Toolbar({
  scopeOptions,
  scope,
  onScopeChange,
  query,
  onQueryChange,
  onSearch,
  placeholder = 'Search…',
  chipOptions,
  chipLabel,
  chipValue,
  onChipChange,
  onReset,
}: ToolbarProps) {
  const scopeDropdown = useDropdown();
  const chipDropdown = useDropdown();

  const scopeLabel = scopeOptions.find(opt => opt.value === scope)?.label ?? '';

  const openScope = () => {
    chipDropdown.setOpen(false);
    scopeDropdown.setOpen(o => !o);
  };
  const openChip = () => {
    scopeDropdown.setOpen(false);
    chipDropdown.setOpen(o => !o);
  };

  return (
    <div className="toolbar">
      <div className="toolbar__searchbar">
        <div className="toolbar__scope" ref={scopeDropdown.ref}>
          <button
            type="button"
            className="toolbar__scope-trigger"
            onClick={openScope}
            aria-haspopup="listbox"
            aria-expanded={scopeDropdown.open}
          >
            <span className="toolbar__scope-label">{scopeLabel}</span>
            <span
              className={`icon icon--sm toolbar__chevron${scopeDropdown.open ? ' toolbar__chevron--open' : ''}`}
              aria-hidden="true"
            >
              expand_more
            </span>
          </button>

          {scopeDropdown.open && (
            <ul className="toolbar__panel" role="listbox">
              {scopeOptions.map(opt => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt.value === scope}
                    className={`toolbar__option${opt.value === scope ? ' toolbar__option--selected' : ''}`}
                    onClick={() => { onScopeChange(opt.value); scopeDropdown.setOpen(false); }}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          className="toolbar__search-input"
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder={placeholder}
        />

        <span className="toolbar__search-icon" aria-hidden="true">
          <span className="icon icon--lg">search</span>
        </span>
      </div>

      <div className="toolbar__chip" ref={chipDropdown.ref}>
        <button
          type="button"
          className="toolbar__chip-trigger"
          onClick={openChip}
          aria-haspopup="listbox"
          aria-expanded={chipDropdown.open}
        >
          {chipLabel}
          <span
            className={`icon icon--sm toolbar__chevron toolbar__chevron--chip${chipDropdown.open ? ' toolbar__chevron--open' : ''}`}
            aria-hidden="true"
          >
            expand_more
          </span>
        </button>

        {chipDropdown.open && (
          <ul className="toolbar__panel toolbar__panel--chip" role="listbox">
            {chipOptions.map(opt => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === chipValue}
                  className={`toolbar__option${opt.value === chipValue ? ' toolbar__option--selected' : ''}`}
                  onClick={() => {
                    onChipChange(opt.value === chipValue ? '' : opt.value);
                    chipDropdown.setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="toolbar__actions">
        <button className="toolbar__search-solid" onClick={onSearch}>Search</button>
        <button className="toolbar__reset" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}
