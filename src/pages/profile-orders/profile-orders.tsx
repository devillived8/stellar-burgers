import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersError,
  selectUserOrdersLoading,
} from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

// import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);
  console.log('Заказы из Redux:', orders);
  console.log('Загрузка:', isLoading);
  console.log('Ошибка:', error);

  useEffect(() => {
    void dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <p>Загрузка истории заказов...</p>;
  }

  if (error) {
    return <p>Не удалось загрузить историю заказов: {error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
