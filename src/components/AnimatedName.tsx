import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Delay between each character for the typewriter effect (~2× slower than prior). */
const TYPE_STEP_MS = 156;

type AnimatedNameProps = {
  text: string;
  className?: string;
  onIntroComplete?: () => void;
};

export function AnimatedName({
  text,
  className,
  onIntroComplete,
}: AnimatedNameProps) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(() => (reduced ? text.length : 0));
  const onIntroCompleteRef = useRef(onIntroComplete);
  onIntroCompleteRef.current = onIntroComplete;

  useEffect(() => {
    const done = () => onIntroCompleteRef.current?.();

    if (reduced) {
      setVisible(text.length);
      queueMicrotask(done);
      return;
    }

    setVisible(0);
    if (text.length === 0) {
      queueMicrotask(done);
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisible(Math.min(i, text.length));
      if (i >= text.length) {
        window.clearInterval(id);
        done();
      }
    }, TYPE_STEP_MS);

    return () => window.clearInterval(id);
  }, [reduced, text]);

  const showCursor = !reduced && visible < text.length;

  return (
    <span
      className={[
        "animated-name",
        reduced ? "animated-name--static" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={text}
    >
      <span className="animated-name__type" aria-hidden>
        {text.slice(0, visible)}
        {showCursor ? (
          <span className="animated-name__cursor" aria-hidden />
        ) : null}
      </span>
    </span>
  );
}
