import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../utils/burger-api';

import type { TIngredient } from '../../utils/types';
import type { RootState } from '../rootReducer';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось загрузить ингредиенты';

    return rejectWithValue(message);
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export const selectIngredients = (state: RootState): TIngredientsState['ingredients'] =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (
  state: RootState
): TIngredientsState['isLoading'] => state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState): TIngredientsState['error'] =>
  state.ingredients.error;

export default ingredientsSlice.reducer;
