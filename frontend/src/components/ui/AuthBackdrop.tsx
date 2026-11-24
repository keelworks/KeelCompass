// decorative background for the auth pages: the two glassy blobs drift and
// morph slowly like a lava lamp, with a handful of small bubbles rising
// organically behind the card. Shared between Auth.tsx and
// CompleteProfile.tsx so both stay visually identical and the randomized
// bubble generation only lives in one place.
const BUBBLES = Array.from({ length: 8 }).map((_, i) => ({
  key: i,
  left: `${8 + ((i * 37) % 85)}%`,
  size: 6 + ((i * 13) % 14),
  delay: -((i * 1.3) % 7),
  duration: 6 + ((i * 2) % 5),
  opacity: 0.35 + ((i * 7) % 30) / 100,
  drift: (i % 2 === 0 ? 1 : -1) * (4 + ((i * 3) % 10)),
}));

function AuthBackdrop() {
  return (
    <>
      <div className="auth-shape-1 absolute rounded-full shadow-lg animate-blob-drift-1" />
      <div className="auth-shape-2 absolute shadow-lg animate-blob-drift-2" />
      {BUBBLES.map((b) => (
        <div
          key={b.key}
          className="auth-bubble"
          style={
            {
              "--bubble-left": b.left,
              "--bubble-size": `${b.size}px`,
              "--bubble-delay": `${b.delay}s`,
              "--bubble-duration": `${b.duration}s`,
              "--bubble-opacity": b.opacity,
              "--bubble-x": `${b.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}

export default AuthBackdrop;
