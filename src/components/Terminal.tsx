import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** First command typed at the `~` prompt. */
const FIRST = "cd jeevan-gowda";
/** After cd'ing in, the dir prefix (shown instantly — no typewriter). */
const DIR = "jeevan-gowda/ ";
/** The command that types out after the dir prefix. */
const SECOND = "yarn dev";

const BOOT_MS = 500; // settle the prompt before typing (avoids startup glitch)
const TYPE_MS = 150; // per-character typing speed
const HOLD_MS = 2000; // pause after `cd jeevan-gowda` finishes, before fade-out
const GAP_MS = 2000; // pause after fade-out, before `yarn dev` types

type Phase = "boot" | "type1" | "hold" | "swap" | "gap" | "type2" | "done";

/**
 * Terminal intro. Types `cd jeevan-gowda` at the `~` prompt, holds, fades that
 * command out, then reveals `jeevan-gowda/ yarn dev` — the dir prefix appears
 * instantly and only `yarn dev` types. The `➜ ~` prompt is anchored and never
 * shifts.
 */
export function Terminal() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<"first" | "second">("first");
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("boot");

  // Reduced motion: skip straight to the final state.
  useEffect(() => {
    if (!reduce) return;
    setStage("second");
    setTyped(SECOND);
    setPhase("done");
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    let t = 0;

    switch (phase) {
      case "boot":
        // Brief pause so the prompt (and font) is painted before typing starts.
        t = window.setTimeout(() => setPhase("type1"), BOOT_MS);
        break;

      case "type1":
        if (typed.length < FIRST.length) {
          t = window.setTimeout(() => setTyped(FIRST.slice(0, typed.length + 1)), TYPE_MS);
        } else {
          setPhase("hold");
        }
        break;

      case "hold":
        t = window.setTimeout(() => {
          // Kick off the swap: clear text and flip the stage so the first
          // command fades out (onExitComplete advances us to the gap).
          setStage("second");
          setTyped("");
          setPhase("swap");
        }, HOLD_MS);
        break;

      case "swap":
        // Waiting on the fade-out; onExitComplete drives the next phase.
        break;

      case "gap":
        // Dir prefix is showing; pause before typing `yarn dev`.
        t = window.setTimeout(() => setPhase("type2"), GAP_MS);
        break;

      case "type2":
        if (typed.length < SECOND.length) {
          t = window.setTimeout(() => setTyped(SECOND.slice(0, typed.length + 1)), TYPE_MS);
        } else {
          setPhase("done");
        }
        break;

      case "done":
        break;
    }

    return () => window.clearTimeout(t);
  }, [phase, typed, reduce]);

  return (
    <main className="term">
      <div className="term__glow" aria-hidden="true" />

      <div className="term__line">
        <span className="term__arrow">➜</span>
        <span className="term__path">~</span>

        <span className="term__cmd-slot">
          <AnimatePresence mode="wait" onExitComplete={() => setPhase("gap")}>
            {stage === "first" ? (
              <motion.span
                key="first"
                className="term__cmd"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {typed}
              </motion.span>
            ) : (
              <motion.span
                key="second"
                className="term__cmd"
                initial={{ opacity: reduce ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <span className="term__dir">{DIR}</span>
                {typed}
              </motion.span>
            )}
          </AnimatePresence>
          <span className="term__cursor" aria-hidden="true" />
        </span>
      </div>
    </main>
  );
}
