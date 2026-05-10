import { useEffect } from 'react';

// Run the given callback when the user presses Escape, only while `active` is true.
export function useEscapeKey(callback, active) {
  useEffect(() => {
    if (!active) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') callback();
    }
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [callback, active]);
}
