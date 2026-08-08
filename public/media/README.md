# Media for the intro panels

Drop your photos/videos here, then point to them in `src/data/intro.ts`
by setting each panel's `media.src` (and `media.poster` for videos).

Suggested files (any name works — just match `src`):

| Panel      | Type  | Example `src`              | Notes                          |
| ---------- | ----- | -------------------------- | ------------------------------ |
| polyglot   | image | `/media/polyglot.jpg`      | portrait-ish, 4:5 looks best   |
| adventurer | image | `/media/adventure.jpg`     |                                |
| filmmaker  | video | `/media/reel.mp4`          | add `poster: "/media/reel.jpg"`|

Until `src` is set, an on-brand placeholder frame is shown automatically.
Paths are relative to `/public`, so `public/media/reel.mp4` → `/media/reel.mp4`.
