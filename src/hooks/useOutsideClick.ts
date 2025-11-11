import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      // Não faz nada se o clique for dentro do elemento referenciado
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event); // Chama o handler se o clique for fora
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Recria o listener se o ref ou o handler mudarem
};