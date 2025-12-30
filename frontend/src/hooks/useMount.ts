/**
 * useMount hook - Hook chạy một lần khi component mount
 */

import { useEffect, EffectCallback } from 'react';

/**
 * Hook chạy effect một lần khi component mount
 * Tương tự useEffect(() => {}, []) nhưng rõ ràng hơn
 * 
 * @param effect - Callback function chạy khi mount
 */
export const useMount = (effect: EffectCallback) => {
  useEffect(effect, []); // eslint-disable-line react-hooks/exhaustive-deps
};
