import { test, expect } from '@playwright/test';

test.describe('Тесты конструктора: модальные окна, ингредиенты, заказ', function () {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients**',
      update: false,
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-access-token',
        url: 'http://localhost:4000',
      },
    ]);

    await page.route('**/api/auth/user**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'TestUser' },
        }),
      });
    });

    await page.route('**/api/orders**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            name: 'Фантастический бургер',
            order: { number: 12345 },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    await expect(page.getByText('Краторная булка')).toBeVisible({ timeout: 10000 });
  });

  test('Добавление ингрединтов в конструктор', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    const mainCard = page.locator('li').filter({ hasText: 'Говяжий метеорит' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();
    const sauceCard = page
      .locator('li')
      .filter({ hasText: 'Соус фирменный Space Sauce' });
    await sauceCard.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByText('Краторная булка N-200i').last()).toBeVisible();
    await expect(page.getByText('Говяжий метеорит (отбивная)').last()).toBeVisible();
    await expect(page.getByText('Соус фирменный Space Sauce').last()).toBeVisible();
  });

  test('Проверка работоспособности модалок ингредиентов', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    const modal = page.getByTestId('modal');
    await bunCard.click();
    await expect(modal).toBeVisible({ timeout: 3000 });
    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(modal.getByText('420')).toBeVisible();
    await expect(modal.getByText('80')).toBeVisible();
    await expect(modal.getByText('24')).toBeVisible();
    const exitBtn = modal.locator('button[aria-label="Закрыть"]');
    await exitBtn.click();
    await expect(modal).toBeHidden();
    await bunCard.click();
    await expect(modal).toBeVisible({ timeout: 3000 });
    await page.mouse.click(10, 10);
    await expect(modal).toBeHidden();
  });

  test('Создание заказа, проверка номера и очистки конструктора', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    const mainCard = page.locator('li').filter({ hasText: 'Говяжий метеорит' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();
    const checkoutBtn = page.getByRole('button', { name: 'Оформить заказ' });
    await checkoutBtn.click();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText('12345')).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
    const closeBtn = page.locator('button[aria-label="Закрыть"]');
    await closeBtn.click();
    await expect(page.getByText('идентификатор заказа')).toBeHidden();
  });
});
