import type { ReactNode } from "react";

// Small drawings of each collected component's shape, for its overview card.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

/** A stack of cards in depth. */
export const CardStackIcon = () => (
  <Icon>
    <rect x="2.75" y="6.75" width="9.5" height="10.5" rx="2" />
    <path d="M6 4.25V4.5M6 4.25a1.5 1.5 0 0 1 1.5-1.5H14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5" strokeLinecap="round" />
  </Icon>
);

/** One open panel beside closed rails. */
export const PanelsIcon = () => (
  <Icon>
    <rect x="2.75" y="3.75" width="14.5" height="12.5" rx="2" />
    <path d="M10.5 3.75v12.5M13.9 3.75v12.5" />
  </Icon>
);

/** Panels narrowing towards the right. */
export const NarrowingBarsIcon = () => (
  <Icon>
    <rect x="2.25" y="3.75" width="7" height="12.5" rx="1.25" />
    <rect x="11.5" y="3.75" width="3" height="12.5" rx="1" />
    <path d="M17.25 3.75v12.5" strokeLinecap="round" />
  </Icon>
);

/** One open story card beside a closed one. */
export const StoriesIcon = () => (
  <Icon>
    <rect x="1.75" y="4.25" width="11" height="11.5" rx="1.75" />
    <rect x="14" y="6.25" width="4" height="7.5" rx="1.25" />
  </Icon>
);

/** Authentication previews for providers, forms, and access controls. */
export const AuthCardsIcon = () => (
  <Icon>
    <rect x="1.5" y="4" width="17" height="12" rx="2" />
    <path d="M7 4v12m6-12v12M3.5 8h1.25m-1.25 3h1.25M9 8h2m-2 3h2m3.75-3 1.25-.65 1.25.65v1.5c0 .8-.55 1.45-1.25 1.75-.7-.3-1.25-.95-1.25-1.75Z" strokeLinecap="round" />
  </Icon>
);

/** A cone, wireframe, and rings across three cards. */
export const SafetyCardsIcon = () => (
  <Icon>
    <path d="M2 5.5h16v9H2zM7.33 5.5v9m5.34-9v9M3.5 11l2.3-2m3 0h2.3v2.3H8.8z" strokeLinecap="round" />
    <circle cx="15.35" cy="10" r="1.05" />
  </Icon>
);

/** Three feature cards with illustrations above their captions. */
export const FeatureCardsIcon = () => (
  <Icon>
    <rect x="1.75" y="4.5" width="4.5" height="11" rx="1" />
    <rect x="7.75" y="4.5" width="4.5" height="11" rx="1" />
    <rect x="13.75" y="4.5" width="4.5" height="11" rx="1" />
    <path d="M3 12.5h2m4 0h2m4 0h2" />
  </Icon>
);

/** A square image with tool chips on either side. */
export const WeaveToolsIcon = () => (
  <Icon>
    <rect x="6.75" y="4.5" width="6.5" height="11" rx="1.5" />
    <path d="M1.75 7h2.5M2.75 12h2m11-5h2.5m-3 5h2" strokeLinecap="round" />
  </Icon>
);

/** Three facets of a geometric media mask. */
export const MediaMaskIcon = () => (
  <Icon>
    <path d="m2 10 4-4 4 4-4 4Zm8 0 4-4 2 2-4 4Zm3 3 4-4 2 2-4 4Z" strokeLinecap="round" strokeLinejoin="round" />
  </Icon>
);

/** Trigger rows connected to a result tile and a return line. */
export const RecurringLoopIcon = () => (
  <Icon>
    <path d="M2.5 4.5h4m-4 3h4m-4 3h4m2.5-6h4a2 2 0 0 1 2 2v2" />
    <rect x="12.5" y="9" width="5" height="5" rx="1" />
    <path d="M15 15.5v.5a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 16v-3" strokeDasharray="1.5 1.5" />
  </Icon>
);

/** A central hub joined to the blocks around it. */
export const HubIcon = () => (
  <Icon>
    <rect x="7.25" y="7.25" width="5.5" height="5.5" rx="1" />
    <rect x="1.75" y="1.75" width="3.5" height="3.5" rx="0.75" />
    <rect x="14.75" y="1.75" width="3.5" height="3.5" rx="0.75" />
    <rect x="8.25" y="15.25" width="3.5" height="3" rx="0.75" />
    <path d="m5.25 5.25 2 2M14.75 5.25l-2 2M10 12.75v2.5" />
  </Icon>
);

/** A feature grid with a wide lead card and a full-width final row. */
export const StripeGridIcon = () => (
  <Icon>
    <rect x="2" y="3" width="10" height="5" rx="1" />
    <rect x="14" y="3" width="4" height="5" rx="1" />
    <rect x="2" y="10" width="4" height="4" rx="1" />
    <rect x="8" y="10" width="4" height="4" rx="1" />
    <rect x="14" y="10" width="4" height="4" rx="1" />
    <path d="M2.5 17h15" strokeLinecap="round" />
  </Icon>
);

export const SurfacesIcon = () => (
  <Icon>
    <rect x="2.75" y="2.75" width="14.5" height="8.5" rx="1.5" />
    <path d="M3.25 14.75h3.5M8.25 14.75h3.5M13.25 14.75h3.5" strokeLinecap="round" />
  </Icon>
);

export const PeelIcon = () => (
  <Icon>
    <path d="M11.5 17.25H4.75a2 2 0 0 1-2-2V4.75a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v6.75" />
    <path d="M17.25 11.5H11.5v5.75Z" />
  </Icon>
);

export const CodeCardIcon = () => (
  <Icon>
    <path d="M10.25 13.75h5a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-7.5a2 2 0 0 0-2 2v5M5.75 6.25h11.5" />
    <rect x="2.75" y="9.75" width="7.5" height="7.5" rx="1.5" />
  </Icon>
);
