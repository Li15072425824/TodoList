interface LogoProps {
  size?: number;
}

/** The Ant Design X mark: two crossed ribbons in blue / purple. */
export default function Logo({ size = 28 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="x-ribbon-a" x1="4" y1="28" x2="28" y2="4">
          <stop offset="0%" stopColor="#1677ff" />
          <stop offset="100%" stopColor="#69b1ff" />
        </linearGradient>
        <linearGradient id="x-ribbon-b" x1="28" y1="28" x2="4" y2="4">
          <stop offset="0%" stopColor="#722ed1" />
          <stop offset="100%" stopColor="#b37feb" />
        </linearGradient>
      </defs>
        <path
          d="M7 25 L22 7"
          stroke="url(#x-ribbon-a)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M25 25 L10 7"
          stroke="url(#x-ribbon-b)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
    </svg>
  );
}
