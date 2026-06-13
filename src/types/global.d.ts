/**
 * Global type definitions
 */

// CSS module support
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.svg' {
  import type { SVGProps } from 'react';
  const content: SVGProps<SVGSVGElement>;
  export const ReactComponent: SVGProps<SVGSVGElement>;
  export default content;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_RAZORPAY_KEY_ID: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
  }
}
