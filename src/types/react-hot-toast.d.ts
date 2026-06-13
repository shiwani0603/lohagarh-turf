import 'react-hot-toast';

declare module 'react-hot-toast' {
  export interface Toaster {
    POSITION: typeof import('react-hot-toast/dist/core/types').POSITION;
  }
}
