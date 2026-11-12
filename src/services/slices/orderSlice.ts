import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi, orderBurgerApi, getOrderByNumberApi } from '@utils/burger-api';

import type { RootState } from '../rootReducer';
import type { TOrder } from '@utils-types';

type TOrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
  orders: TOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
  selectedOrder: TOrder | null;
  selectedOrderLoading: boolean;
  selectedOrderError: string | null;
};

const initialState: TOrderState = {
  order: null,
  isLoading: false,
  error: null,
  orders: [],
  ordersLoading: false,
  ordersError: null,
  selectedOrder: null,
  selectedOrderLoading: false,
  selectedOrderError: null,
};

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      return rejectWithValue('Заказ не найден');
    }

    return order;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось загрузить заказ'
    );
  }
});

export const createOrder = createAsyncThunk<TOrder, string[], { rejectValue: string }>(
  'order/createOrder',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось оформить заказ'
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk<TOrder[], void, { rejectValue: string }>(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить историю заказов'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
    clearUserOrders: (state) => {
      state.orders = [];
      state.ordersError = null;
      state.ordersLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError =
          action.payload ??
          action.error.message ??
          'Не удалось загрузить историю заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.selectedOrderLoading = true;
        state.selectedOrderError = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.selectedOrderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.selectedOrderLoading = false;
        state.selectedOrderError =
          action.payload ?? action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const { clearOrder, clearUserOrders } = orderSlice.actions;

export const selectOrder = (state: RootState): TOrder | null => state.order.order;

export const selectOrderLoading = (state: RootState): boolean => state.order.isLoading;

export const selectOrderError = (state: RootState): string | null => state.order.error;

export const selectUserOrders = (state: RootState): TOrder[] => state.order.orders;

export const selectSelectedOrder = (state: RootState): TOrder | null =>
  state.order.selectedOrder;

export const selectSelectedOrderLoading = (state: RootState): boolean =>
  state.order.selectedOrderLoading;

export const selectSelectedOrderError = (state: RootState): string | null =>
  state.order.selectedOrderError;

export const selectUserOrdersLoading = (state: RootState): boolean =>
  state.order.ordersLoading;

export const selectUserOrdersError = (state: RootState): string | null =>
  state.order.ordersError;

export default orderSlice.reducer;
