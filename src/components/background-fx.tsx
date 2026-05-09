export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-60 blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.16 250 / 0.55), transparent 65%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl animate-float"
        style={{
          background: "radial-gradient(circle, oklch(0.7 0.18 310 / 0.5), transparent 65%)",
          animationDelay: "-3s",
        }}
      />
      <div
        className="absolute bottom-0 -left-32 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl animate-float"
        style={{
          background: "radial-gradient(circle, oklch(0.7 0.16 220 / 0.45), transparent 65%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
