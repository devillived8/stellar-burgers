import type { ReactNode } from 'react';

export type PageWrapperProps = {
  title?: string;
  useOrderNumber?: boolean;
  marginTop?: number;
  children: ReactNode;
};
