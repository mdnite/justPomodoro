import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast'; 
import { useSettings } from '../../context/SettingsContext';
import { ALARM_SOUNDS } from '../../hooks/alarmSounds';
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
  const [activeSection, setActiveSection] = useState('timer');
  const audioRef = useRef(null); // Audio reference to keep track of audio object

  // Update one form field when the user types into an input.
  function handleNumberChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value === '' ? '' : Number(value) }));
  }

  // Revert unsaved edits back to the last-loaded settings.
  function handleReset() {
    if (settings) setForm(settings);
  }

  // Persist form values via the settings context, then show feedback.
  async function handleSubmit(e) {
    e.preventDefault();
    // setError(null);
    // setStatus(null);
    try {
      await saveSettings({
        work_duration: Number(form.work_duration),
        short_break: Number(form.short_break),
        long_break: Number(form.long_break),
        sound_enabled: !!form.sound_enabled,
        sessions_before_long_break: Number(form.sessions_before_long_break),
        alarm_sound: form.alarm_sound,
        alarm_volume: Number(form.alarm_volume ?? 1),
      });
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.message);
    }
  }

  // Previews alarm sound when users selects one
  function handleSoundChange(value) {
    setForm((prev) => ({ ...prev, alarm_sound: value}));
    
    // stop previous alarm
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // preview the selected sound
    const sound = ALARM_SOUNDS.find((s) => s.value === value);
    if (sound) {
      const audio = new Audio(sound.src);
      audio.volume = form.alarm_volume ?? 1;

      audioRef.current = audio;

      audio.play().catch((error) => {
        console.error("Audio playback failed: ", error);
      });
    }
  }

  // Toggle checkbox for alarm sound
  function handleToggleSound(checked) {
    setForm((prev) => ({ ...prev, sound_enabled: checked }));
  }

  // Handle volume change
  function handleVolumeChange(value) {
    const volume = Number(value);
    setForm((prev) => ({ ...prev, alarm_volume: volume }));

    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }

  return (
    <div className="settings_container">
      <Toaster position="top-center"/>
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
              <> 
                {/* Dropdown menu for alarm sound selection */}
                <label className='settings__field'>
                  <span className='settings__label'>Select alert sound</span>
                  <select className='settings__select'
                          value={form.alarm_sound ?? 'alarm_1'}
                          onChange={(e) => handleSoundChange(e.target.value)}
                          >
                    {ALARM_SOUNDS.map((sound) => (
                      <option key={sound.value} value={sound.value}>
                        {sound.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className='settings__field'>
                  <span className='settings__label'>Alert Volume ({Math.round((form.alarm_volume ?? 1) * 100)}%)</span>
                  <input
                    className='settings__slider'
                    type='range'
                    min={0}
                    max={1}
                    step={0.01}
                    value={form.alarm_volume ?? 1}
                    onChange={(e) => handleVolumeChange(e.target.value)}
                  />
                </label>

                <label className="settings__field settings__field--checkbox">
                  <input
                    type="checkbox"
                    checked={!!form.sound_enabled}
                    onChange={(e) => handleToggleSound(e.target.checked)}
                    />
                  <span className="settings__label">Sound Enabled</span>
                </label>
              </>
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
    </div>
  );
}
