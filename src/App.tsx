import { useEffect, useState } from "react";
import { AnimatedName } from "./components/AnimatedName";
import { FloatingIcons } from "./components/FloatingIcons";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const NAME = "Jeevan Gowda";
const TAGLINE = "Stay tuned !";

/** Icons soon after tagline starts (overlap most of the fade) */
const TAGLINE_TO_ICONS_MS = 300;

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    if (!taglineVisible) return;
    const delay = reducedMotion ? 80 : TAGLINE_TO_ICONS_MS;
    const t = window.setTimeout(() => setShowIcons(true), delay);
    return () => window.clearTimeout(t);
  }, [taglineVisible, reducedMotion]);

  return (
    <div className="hero">
      <FloatingIcons visible={showIcons} />
      <main className="layout hero__content">
        <div className="hero__title-block">
          <h1 className="hero__headline">
            <AnimatedName
              text={NAME}
              onIntroComplete={() => {
                window.setTimeout(
                  () => setTaglineVisible(true),
                  reducedMotion ? 0 : 120,
                );
              }}
            />
          </h1>
          <p
            className={[
              "hero__tagline",
              taglineVisible ? "hero__tagline--visible" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={!taglineVisible}
            aria-live="polite"
          >
            {TAGLINE}
          </p>
        </div>
      </main>
    </div>
  );
}
