import { selectUser } from '@/services/slices/userSlice';
import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
