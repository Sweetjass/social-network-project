import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем все роли с информацией о группах разрешений', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const response = await apiContext.get('/Role');

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа
  console.log('Статус ответа:', response.status()); // Выводим статус

  expect(data).toHaveProperty('result');
  expect(Array.isArray(data.result)).toBe(true);

  // Проверяем каждый элемент массива result
  for (const roleItem of data.result) {
    expect(roleItem).toHaveProperty('role');
    expect(roleItem.role).toHaveProperty('id');
    expect(roleItem.role).toHaveProperty('name');
    expect(roleItem.role).toHaveProperty('description');

    expect(roleItem).toHaveProperty('permissions');
    expect(Array.isArray(roleItem.permissions)).toBe(true);

    for (const perm of roleItem.permissions) {
      expect(typeof perm).toBe('number');
    }
  }
  console.log('Роли:', util.inspect(data, { depth: null, colors: true }));
  await apiContext.dispose();
});
