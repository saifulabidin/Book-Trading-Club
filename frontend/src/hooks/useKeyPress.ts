import { useState, useEffect, useCallback } from 'react';

type KeyboardKey = string;
type KeyOptions = {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

/**
 * Custom hook for detecting keyboard key presses
 * @param targetKey - The key to detect (e.g., 'Escape', 'Enter')
 * @param options - Optional modifier keys (e.g., { ctrl: true })
 * @returns boolean indicating if the specified key(s) are pressed
 */
export default function useKeyPress(targetKey: KeyboardKey, options: KeyOptions = {}): boolean {
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false);
  
  const { ctrl = false, alt = false, shift = false, meta = false } = options;

  const downHandler = useCallback((event: KeyboardEvent): void => {
    if (
      event.key === targetKey &&
      (!ctrl || event.ctrlKey) &&
      (!alt || event.altKey) &&
      (!shift || event.shiftKey) &&
      (!meta || event.metaKey)
    ) {
      setIsKeyPressed(true);
    }
  }, [targetKey, ctrl, alt, shift, meta]);

  const upHandler = useCallback((event: KeyboardEvent): void => {
    if (
      event.key === targetKey &&
      (!ctrl || event.ctrlKey) &&
      (!alt || event.altKey) &&
      (!shift || event.shiftKey) &&
      (!meta || event.metaKey)
    ) {
      setIsKeyPressed(false);
    }
  }, [targetKey, ctrl, alt, shift, meta]);

  useEffect(() => {
    // Add event listeners
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]); // Re-run if downHandler or upHandler changes
  
  return isKeyPressed;
}