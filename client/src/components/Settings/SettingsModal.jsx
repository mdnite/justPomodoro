import Settings from './Settings';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import './SettingsModal.css';

// Modal overlay that wraps the Settings form; owns its own close paths (backdrop, X, Escape).
export default function SettingsModal({ isOpen, onClose, autoStart, toggleAutoStart }) { // NOSONAR
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="settings-modal__overlay">
      <button
        type="button"
        className="settings-modal__backdrop"
        aria-label="Close settings"
        onClick={onClose}
      />
      <div className="settings-modal" role="dialog" aria-modal="true" aria-label="Settings">
        <button
          className="settings-modal__close"
          type="button"
          aria-label="Close settings"
          onClick={onClose}
        >
          ×
        </button>
        <Settings autoStart={autoStart} toggleAutoStart={toggleAutoStart} />
      </div>
    </div>
  );
}
