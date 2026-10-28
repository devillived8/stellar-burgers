import { memo } from 'react';
import { useParams } from 'react-router-dom';

import type { PageWrapperProps } from './type';

import styles from './page-wrapper.module.css';

export const PageWrapper = memo(function PageWrapper({
  title,
  useOrderNumber = false,
  variant,
  children,
}: PageWrapperProps): React.JSX.Element {
  const { number } = useParams<{ number: string }>();

  const pageTitle = useOrderNumber ? `#000${number}` : title;

  const titleClassName = useOrderNumber
    ? 'text text_type_digits-default'
    : 'text text_type_main-large';

  const pageClassName = [styles.page, variant ? styles[variant] : '']
    .filter(Boolean)
    .join(' ');

  return (
    <main className={pageClassName}>
      {pageTitle && <h1 className={titleClassName}>{pageTitle}</h1>}
      {children}
    </main>
  );
});
