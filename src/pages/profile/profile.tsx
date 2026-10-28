import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { selectUser, updateUserThunk } from '../../services/slices/userSlice';
import { useSelector, useDispatch } from '../../services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const userName = user?.name ?? '';
  const userEmail = user?.email ?? '';

  const [formValue, setFormValue] = useState({
    name: userName,
    email: userEmail,
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: userName,
      email: userEmail,
    }));
  }, [userName, userEmail]);

  const isFormChanged =
    formValue.name !== userName || formValue.email !== userEmail || !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    try {
      await dispatch(
        updateUserThunk({
          name: formValue.name,
          email: formValue.email,
          ...(formValue.password ? { password: formValue.password } : {}),
        })
      ).unwrap();

      setFormValue((prevState) => ({
        ...prevState,
        password: '',
      }));
    } catch (error) {
      console.error('Не удалось обновить профиль:', error);
    }
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: userName,
      email: userEmail,
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={(e) => {
        void handleSubmit(e);
      }}
      handleInputChange={handleInputChange}
    />
  );
};
