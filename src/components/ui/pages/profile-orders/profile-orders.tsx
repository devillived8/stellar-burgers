import { ProfileMenu, OrdersList } from '@components';
import { Preloader } from '@ui';

import type { ProfileOrdersUIProps } from './type';

import styles from './profile-orders.module.css';

export const ProfileOrdersUI = ({
  orders,
  isLoading,
  error,
}: ProfileOrdersUIProps): React.JSX.Element => (
  <main className={`${styles.main}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <div className={`mt-10 ${styles.orders}`}>
      {isLoading ? (
        <Preloader />
      ) : error ? (
        <p>Не удалось загрузить историю заказов: {error}</p>
      ) : (
        <OrdersList orders={orders} />
      )}
    </div>
  </main>
);
