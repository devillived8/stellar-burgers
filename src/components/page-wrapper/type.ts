import type { ReactNode } from 'react';

export type PageWrapperProps = {
  title?: string;
  useOrderNumber?: boolean;
  variant?: 'order' | 'ingredient';
  children: ReactNode;
};
