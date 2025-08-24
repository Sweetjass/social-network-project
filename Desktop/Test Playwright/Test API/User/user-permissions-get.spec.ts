import { test, expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем информацию о всех пользователях и их разрешениях', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState // Передаем куки из нашего файла
});

  const response = await apiContext.get(`/User/permissions`); // Дергаем ручку Гет с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус ответа
  
  const data = await response.json(); // Формируем json ответа

  expect(data).toHaveProperty('isSuccess', true);
  expect(data).toHaveProperty('result');
  expect(Array.isArray(data.result)).toBe(true);
  expect(data.result.length).toBeGreaterThan(0);

  data.result.forEach(item => {
    expect(item).toHaveProperty('user');
    expect(item.user).toHaveProperty('id');
    expect(item.user).toHaveProperty('userName');

    expect(item).toHaveProperty('permissions');
    expect(Array.isArray(item.permissions)).toBe(true);
  });
  console.log('Статус ответа:', response.status()); // Выводим статус
  console.log('Все пользователи и разрешения:', util.inspect(data.result, { depth: null, colors: true }));

  await apiContext.dispose();
});
