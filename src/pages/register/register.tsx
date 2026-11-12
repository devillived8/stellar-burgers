import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { registerUserThunk } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TLocationState } from '@/utils/types';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useSelector((state) => state.user);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as TLocationState | null)?.from ?? '/';

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    try {
      await dispatch(
        registerUserThunk({
          name: userName,
          email,
          password,
        })
      ).unwrap();

      void navigate(from, { replace: true });
    } catch (error) {
      console.error('Ошибка регистрации', error);
    }
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={(e) => {
        void handleSubmit(e);
      }}
    />
  );
};
