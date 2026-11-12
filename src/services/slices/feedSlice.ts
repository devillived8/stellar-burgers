import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@utils/burger-api';

import type { RootState } from '../rootReducer';
import type { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk<
  Pick<TFeedState, 'orders' | 'total' | 'totalToday'>,
  void,
  { rejectValue: string }
>('feed/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();

    return {
      orders: response.orders,
      total: response.total,
      totalToday: response.totalToday,
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось загрузить ленту заказов'
    );
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось загрузить ленту заказов';
      });
  },
});

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;

export const selectFeedTotal = (state: RootState): number => state.feed.total;

export const selectFeedTotalToday = (state: RootState): number => state.feed.totalToday;

export const selectFeedLoading = (state: RootState): boolean => state.feed.isLoading;

export const selectFeedError = (state: RootState): string | null => state.feed.error;

export default feedSlice.reducer;
