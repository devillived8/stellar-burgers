import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUserThunk } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TLocationState } from '@/utils/types';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as TLocationState | null)?.from ?? '/';

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    try {
      await dispatch(
        loginUserThunk({
          email,
          password,
        })
      ).unwrap();
      void navigate(from, { replace: true });
    } catch (error) {
      console.error('Ошибка', error);
    }
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={(e) => {
        void handleSubmit(e);
      }}
    />
  );
};
