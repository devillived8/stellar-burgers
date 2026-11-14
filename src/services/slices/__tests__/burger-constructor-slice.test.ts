import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../constructorSlice';

import type { TConstructorIngredient, TIngredient } from '@utils-types';

describe('Тестирование редьюсера constructorSlice', () => {
  const mockBun: TIngredient = {
    _id: '1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'img.png',
    image_mobile: 'img-mobile.png',
    image_large: 'img-large.png',
  };

  const mockMain: TIngredient = {
    _id: '2',
    name: 'Говяжий метеорит',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'img.png',
    image_mobile: 'img-mobile.png',
    image_large: 'img-large.png',
  };

  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('должен добавлять булку', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));

    expect(state.bun).toBeDefined();
    expect(state.bun?.name).toBe('Краторная булка');
    expect(state.bun?.type).toBe('bun');
    expect(state.bun?.id).toEqual(expect.any(String));
    expect(state.ingredients).toEqual([]);
  });

  test('должен добавлять начинку', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));

    expect(state.bun).toBeNull();
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0].name).toBe('Говяжий метеорит');
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  test('должен удалять начинку по её id', () => {
    const stateWithMain = constructorReducer(undefined, addIngredient(mockMain));
    const addedId = stateWithMain.ingredients[0].id;
    const state = constructorReducer(stateWithMain, removeIngredient(addedId));

    expect(state.ingredients).toEqual([]);
  });

  test('должен перемещать ингредиенты', () => {
    const stateWithTwo = constructorReducer(
      {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'id-1' } as TConstructorIngredient,
          { ...mockMain, id: 'id-2' } as TConstructorIngredient,
        ],
      },
      { type: 'UNKNOWN' }
    );

    const state = constructorReducer(stateWithTwo, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });

  test('должен очищать конструктор', () => {
    let state = constructorReducer(undefined, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockMain));
    const finalState = constructorReducer(state, clearConstructor());

    expect(finalState.bun).toBeNull();
    expect(finalState.ingredients).toEqual([]);
  });
});
