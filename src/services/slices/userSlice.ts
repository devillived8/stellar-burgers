import { deleteCookie, setCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
} from '../../utils/burger-api';

import type { TRegisterData, TLoginData } from '../../utils/burger-api';
import type { RootState } from '../rootReducer';
import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
};

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось обновить данные пользователя'
    );
  }
});

export const registerUserThunk = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка регистрации'
    );
  }
});

export const logoutUserThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();

      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка выхода');
    }
  }
);

export const loginUserThunk = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Ошибка входа');
  }
});

export const getUserThunk = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();

      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось получить пользователя'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка регистрации';
        state.isAuthChecked = true;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка входа';
        state.isAuthChecked = true;
      })

      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = action.payload ?? 'Не удалось получить пользователя';
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка выхода';
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось обновить данные пользователя';
      });
  },
});

export const { setAuthChecked } = userSlice.actions;
export const selectUser = (state: RootState): TUser | null => state.user.user;
export default userSlice.reducer;
