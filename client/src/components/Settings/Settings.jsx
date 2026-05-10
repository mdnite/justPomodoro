import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import './Settings.css';

const TIMER_FIELDS = [
  { key: 'work_duration', label: 'Work Duration (minutes)', min: 1, max: 180 },
  { key: 'short_break', label: 'Short Break (minutes)', min: 1, max: 60 },
  { key: 'long_break', label: 'Long Break (minutes)', min: 1, max: 120 },
  { key: 'sessions_before_long_break', label: 'Sessions Before Long Break', min: 1, max: 10 },
];

const SECTIONS = [
  { id: 'timer', label: 'Timer' },
  { id: 'sound', label: 'Sound' },
  { id: 'music', label: 'Music' },
];

// Gate the settings form on initial settings load.
export default function Settings({ autoStart, toggleAutoStart }) { // NOSONAR
  const { settings } = useSettings();
  if (!settings) return null;
  return <SettingsForm settings={settings} autoStart={autoStart} toggleAutoStart={toggleAutoStart} />;
}

// Settings panel for editing the user's timer preferences.
function SettingsForm({ settings, autoStart, toggleAutoStart }) { // NOSONAR
  const { saveSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('timer');

  // Update one form field when the user types into an input.
  function handleNumberChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value === '' ? '' : Number(value) }));
  }

  // Toggle the sound_enabled boolean.
  function handleSoundChange(checked) {
    setForm((prev) => ({ ...prev, sound_enabled: checked }));
  }

  // Set status and error to null after 3 seconds.
  useEffect(() => {
    if (!status && !error) return;
    const id = setTimeout(() => {
      setStatus(null);
      setError(null);
    }, 3000);
    return () => clearTimeout(id);
  }, [status, error]);

  // Revert unsaved edits back to the last-loaded settings.
  function handleReset() {
    if (settings) setForm(settings);
    setStatus(null);
    setError(null);
  }

  // Persist form values via the settings context, then show feedback.
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    try {
      await saveSettings({
        work_duration: Number(form.work_duration),
        short_break: Number(form.short_break),
        long_break: Number(form.long_break),
        sound_enabled: !!form.sound_enabled,
        sessions_before_long_break: Number(form.sessions_before_long_break),
      });
      setStatus('Saved');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="settings_container">
      <form className="settings" onSubmit={handleSubmit}>
        <h2 className="settings__heading">Settings</h2>
        <div className="settings__layout">
          <nav className="settings__nav" aria-label="Settings sections">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`settings__nav-item ${activeSection === section.id ? 'settings__nav-item--active' : ''}`}
                onClick={() => setActiveSection(section.id)}
                aria-pressed={activeSection === section.id}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="settings__panel">
            {activeSection === 'timer' && (
              <>
                {TIMER_FIELDS.map((field) => (
                  <label key={field.key} className="settings__field">
                    <span className="settings__label">{field.label}</span>
                    <input
                      className="settings__input"
                      type="number"
                      min={field.min}
                      max={field.max}
                      value={form[field.key] ?? ''}
                      onChange={(e) => handleNumberChange(field.key, e.target.value)}
                    />
                  </label>
                ))}
                <div className="settings__widget-row">
                  <span className="settings__label">Auto Start</span>
                  <button
                    type="button"
                    className={`settings__toggle ${autoStart ? 'settings__toggle--on' : ''}`}
                    onClick={toggleAutoStart}
                  >
                    {autoStart ? 'ON' : 'OFF'}
                  </button>
                </div>
              </>
            )}

            {activeSection === 'sound' && (
              <label className="settings__field settings__field--checkbox">
                <input
                  type="checkbox"
                  checked={!!form.sound_enabled}
                  onChange={(e) => handleSoundChange(e.target.checked)}
                />
                <span className="settings__label">Sound Enabled</span>
              </label>
            )}

            {activeSection === 'music' && (
              <p className="settings__placeholder">Coming soon</p>
            )}
          </div>
        </div>

        <div className="settings__actions">
          <button className="settings__reset" type="button" onClick={handleReset}>
            Reset Changes
          </button>
          <button className="settings__save" type="submit">Save</button>
        </div>
      </form>
      {status && <p className="settings__status">{status}</p>}
      {error && <p className="settings__error">{error}</p>}
    </div>
  );
}
