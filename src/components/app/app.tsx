import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '../../services/slices/ingredientSlice';
import { getUserThunk, setAuthChecked } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { PageWrapper } from '../page-wrapper';
import { ProtectedRoute } from '../protected-route/protected-route';

import type { AppContentProps } from './type';
import type { TIngredient, TLocationState } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem('refreshToken')) {
      void dispatch(getUserThunk());
    } else {
      dispatch(setAuthChecked());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as TLocationState | null;
  const background = locationState?.background;

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/feed/:number"
          element={
            <PageWrapper useOrderNumber variant="order">
              <OrderInfo />
            </PageWrapper>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <PageWrapper title="Детали ингредиента" variant="ingredient">
              <IngredientDetails />
            </PageWrapper>
          }
        />
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route
            path="/profile/orders/:number"
            element={
              <PageWrapper useOrderNumber variant="order">
                <OrderInfo />
              </PageWrapper>
            }
          />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
