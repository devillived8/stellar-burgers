import ingredientsReducer, { fetchIngredients } from '../ingredientSlice';

import type { TIngredientsState } from '../ingredientSlice';
import type { TIngredient } from '@/utils/types';

describe('Тестирование редьюсера ingredientsSlice', () => {
  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    const initialState = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(initialState).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('должен включать isLoading при fetchIngredients.pending', () => {
    const previousState: TIngredientsState = {
      ingredients: [],
      isLoading: false,
      error: 'Какая-то ошибка',
    };

    const newState = ingredientsReducer(
      previousState,
      fetchIngredients.pending('', undefined)
    );

    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('должен записывать ингредиенты и выключать isLoading при fetchIngredients.fulfilled', () => {
    const previousState: TIngredientsState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'image.png',
        image_mobile: 'image-mobile.png',
        image_large: 'image-large.png',
      },
    ];

    const newState = ingredientsReducer(
      previousState,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(newState.isLoading).toBe(false);
    expect(newState.ingredients).toEqual(mockIngredients);
    expect(newState.error).toBeNull();
  });

  test('должен записывать ошибку и выключать isLoading при fetchIngredients.rejected', () => {
    const previousState: TIngredientsState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const errorPayload = 'Не удалось загрузить ингредиенты';

    const newState = ingredientsReducer(
      previousState,
      fetchIngredients.rejected(null, '', undefined, errorPayload)
    );

    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(errorPayload);
  });
});
