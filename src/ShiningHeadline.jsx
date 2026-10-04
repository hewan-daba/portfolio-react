import { useId } from "react";

function ShiningHeadline({
  children,
  baseColor = "rgba(255,255,255,0.5)",
  shineColor = "#b7ff89",
  duration = 3.2,
}) {
  const rawId = useId();
  const animationName = `headlineSweep${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <>
      <style>{`
        @keyframes ${animationName} {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>

      <span
        style={{
          color: baseColor,
          backgroundImage: `linear-gradient(
            110deg,
            ${baseColor} 35%,
            ${shineColor} 50%,
            ${baseColor} 65%
          )`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `${animationName} ${duration}s linear infinite`,
        }}
      >
        {children}
      </span>
    </>
  );
}
export default ShiningHeadline;
