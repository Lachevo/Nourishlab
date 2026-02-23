import { useEffect, useRef, useState } from 'react';

type RevealOptions = {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
};

/**
 * Returns a [ref, isVisible] pair.
 * Attach `ref` to any DOM element. `isVisible` flips to true when
 * the element enters the viewport.
 */
export function useScrollReveal<T extends Element = HTMLDivElement>({
    threshold = 0.15,
    rootMargin = '0px 0px -60px 0px',
    once = true,
}: RevealOptions = {}) {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return [ref, isVisible] as const;
}
