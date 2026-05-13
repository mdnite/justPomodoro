export const ALARM_SOUNDS = [
  { value: 'alarm_1', label: 'Alarm Sound 1', src: '/sounds/alarm_sound_1.mp3' },
  { value: 'alarm_2', label: 'Alarm Sound 2', src: '/sounds/alarm_sound_2.mp3' },
  { value: 'alarm_3', label: 'Alarm Sound 3', src: '/sounds/alarm_sound_3.mp3' },
  { value: 'alarm_4', label: 'Alarm Sound 4', src: '/sounds/alarm_sound_4.mp3' },
];

export function getAlarmSrc(alarmSoundValue) {
    return ALARM_SOUNDS.find((s) => s.value === alarmSoundValue)?.src ?? '/sounds/alarm_sound_1.mp3';
}