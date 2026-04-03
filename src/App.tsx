import { useEffect, useState } from "react";
import { AnimatedName } from "./components/AnimatedName";
import { FloatingIcons } from "./components/FloatingIcons";

const NAME = "Jeevan Gowda";
const TAGLINE = "Stay tuned !";

/** After tagline fade-in (~0.85s) + beat before icons */
const TAGLINE_TO_ICONS_MS = 950;

export default function App() {
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    if (!taglineVisible) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const delay = reduced ? 80 : TAGLINE_TO_ICONS_MS;
    const t = window.setTimeout(() => setShowIcons(true), delay);
    return () => window.clearTimeout(t);
  }, [taglineVisible]);

  return (
    <div className="hero">
      <FloatingIcons visible={showIcons} />
      <main className="layout hero__content">
        <div className="hero__title-block">
          <h1 style={{ margin: 0, font: "inherit" }}>
            <AnimatedName
              text={NAME}
              onIntroComplete={() => {
                const reduced = window.matchMedia(
                  "(prefers-reduced-motion: reduce)",
                ).matches;
                window.setTimeout(
                  () => setTaglineVisible(true),
                  reduced ? 0 : 120,
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
