/// <reference types="vite/client" />

// SVG imports with ?react suffix
declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

// Regular SVG imports
declare module '*.svg' {
  const content: string;
  export default content;
}
