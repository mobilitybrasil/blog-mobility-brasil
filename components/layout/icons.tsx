import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function BarsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function AngleRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function AngleLeftIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function AngleDownIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function BagShoppingIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.86 0-7 2.46-7 5.5V21h14v-1.5c0-3.04-3.14-5.5-7-5.5z" />
    </svg>
  );
}

export function MessageCaptionsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      <path d="M7 9.5h7" />
      <path d="M7 13h5" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 8 8"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M1.5 6.5 6.5 1.5" />
      <path d="M2.5 1.5h4v4" />
    </svg>
  );
}

export function VolumeOnIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 10v4a1 1 0 0 0 1 1h3l4 3.5V5.5L8 9H5a1 1 0 0 0-1 1z" />
      <path d="M16 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a8 8 0 0 1 0 12" />
    </svg>
  );
}

export function VolumeOffIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 10v4a1 1 0 0 0 1 1h3l4 3.5V5.5L8 9H5a1 1 0 0 0-1 1z" />
      <path d="M16 9.5l5 5" />
      <path d="M21 9.5l-5 5" />
    </svg>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 9V4h5" />
      <path d="M20 9V4h-5" />
      <path d="M4 15v5h5" />
      <path d="M20 15v5h-5" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42a3.7 3.7 0 0 1 1.38.9c.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.25.07 1.62.07 4.8 0 3.18 0 3.55-.07 4.8-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.43.16-1.06.36-2.23.41-1.25.06-1.62.07-4.85.07-3.22 0-3.59 0-4.84-.07-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.25-.07-1.62-.07-4.8 0-3.18 0-3.55.07-4.8.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38a3.7 3.7 0 0 1 1.38-.9c.43-.17 1.06-.37 2.23-.42C8.41 2.2 8.78 2.2 12 2.2zm0 1.95c-3.17 0-3.52 0-4.76.07-1.07.05-1.65.23-2.04.39-.51.2-.88.44-1.26.82-.38.38-.62.75-.82 1.26-.16.4-.34.97-.39 2.04-.06 1.24-.07 1.6-.07 4.77 0 3.16.01 3.52.07 4.76.05 1.07.23 1.65.39 2.04.2.51.44.88.82 1.26.38.38.75.62 1.26.82.39.16.97.34 2.04.39 1.24.06 1.6.07 4.76.07 3.17 0 3.52-.01 4.76-.07 1.07-.05 1.65-.23 2.04-.39.51-.2.88-.44 1.26-.82.38-.38.62-.75.82-1.26.16-.39.34-.97.39-2.04.06-1.24.07-1.6.07-4.76 0-3.17-.01-3.53-.07-4.77-.05-1.07-.23-1.65-.39-2.04-.2-.51-.44-.88-.82-1.26a3.4 3.4 0 0 0-1.26-.82c-.39-.16-.97-.34-2.04-.39-1.24-.07-1.6-.07-4.76-.07zm0 3.33a4.52 4.52 0 1 1 0 9.04 4.52 4.52 0 0 1 0-9.04zm0 7.45a2.94 2.94 0 1 0 0-5.88 2.94 2.94 0 0 0 0 5.88zm5.77-7.63a1.06 1.06 0 1 1-2.12 0 1.06 1.06 0 0 1 2.12 0z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.84c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.77l-.44 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.63c.3 0 .58.05.85.13v-3.5a6.4 6.4 0 0 0-.85-.06A6.34 6.34 0 0 0 5.4 21.42a6.34 6.34 0 0 0 10.85-4.5V9.8a8.16 8.16 0 0 0 4.81 1.54V7.88a4.85 4.85 0 0 1-1.47-.39z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.58 7.19c-.23-.86-.9-1.54-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42c-.86.23-1.53.91-1.76 1.77C2 8.76 2 12 2 12s0 3.24.42 4.81c.23.86.9 1.54 1.76 1.77 1.57.42 7.82.42 7.82.42s6.25 0 7.82-.42a2.47 2.47 0 0 0 1.76-1.77C22 15.24 22 12 22 12s0-3.24-.42-4.81zM10 15.02V8.98L15.2 12 10 15.02z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.4c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.08-.12-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.41 1.27 4.84L2 22l5.34-1.4A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.18a8.13 8.13 0 0 1-4.14-1.13l-.3-.18-3.07.8.82-3-.2-.31A8.18 8.18 0 1 1 12 20.18z" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="5.5" r="2.4" />
      <circle cx="18" cy="18.5" r="2.4" />
      <path d="M8.2 10.9l7.6-4.3" />
      <path d="M8.2 13.1l7.6 4.3" />
    </svg>
  );
}

export function AccessibilityIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="4.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M6.5 8.5h11" />
      <path d="M12 8.5v5.5l3.5 6" />
      <path d="M12 14l-3.5 6" />
    </svg>
  );
}
