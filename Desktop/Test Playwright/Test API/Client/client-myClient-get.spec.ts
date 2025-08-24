import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем клиентов', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const response = await apiContext.get('/Client/myClient'); // Дергаем ручку get

  expect(response.status()).toBe(200); // Проверяем статус запроса

  const data = await response.json(); // Формируем json ответа

  expect(data).toHaveProperty('isSuccess', true);
  
  if (data.result === undefined) {
    console.log('Данные о вашем клиенте: не определены');
  } else {
    console.log('Данные о вашем клиенте:', util.inspect(data.result, { depth: null, colors: true }));
  }
  
  await apiContext.dispose();
});
