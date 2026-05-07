import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import './Settings.css';

const FIELDS = [
  { key: 'work_duration', label: 'Work duration (min)', min: 1, max: 180 },
  { key: 'short_break', label: 'Short break (min)', min: 1, max: 60 },
  { key: 'long_break', label: 'Long break (min)', min: 1, max: 120 },
  { key: 'sessions_before_long_break', label: 'Sessions before long break', min: 1, max: 10 },
];

// Settings panel for editing the user's timer preferences.
export default function Settings() {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  // Update one form field when the user types into an input.
  function handleNumberChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value === '' ? '' : Number(value) }));
  }

  // Toggle the sound_enabled boolean.
  function handleSoundChange(checked) {
    setForm((prev) => ({ ...prev, sound_enabled: checked }));
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

  if (!form) return null;

  return (
    <form className="settings" onSubmit={handleSubmit}>
      <h2 className="settings__heading">Settings</h2>
      {FIELDS.map((field) => (
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
      <label className="settings__field settings__field--checkbox">
        <input
          type="checkbox"
          checked={!!form.sound_enabled}
          onChange={(e) => handleSoundChange(e.target.checked)}
        />
        <span className="settings__label">Sound enabled</span>
      </label>
      <button className="settings__save" type="submit">Save</button>
      {status && <p className="settings__status">{status}</p>}
      {error && <p className="settings__error">{error}</p>}
    </form>
  );
}
