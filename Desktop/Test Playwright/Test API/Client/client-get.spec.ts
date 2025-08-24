import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем клиентов', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const id = 1;
  const response = await apiContext.get(`/Client?ids=${id}`); // Дергаем ручку Гет с нужным ID

  const data = await response.json();// Формируем json ответа

  console.log('Статус ответа:', response.status()); // Выводим статус
  expect(data).toHaveProperty('result')
  expect(data).toHaveProperty('isSuccess', true);
  if (data.result.some((client: any) => 'id' in client)) {
    console.log('Клиент:', util.inspect(data.result, { depth: null, colors: true }));
} else {
    console.log('Клиент с данным идентификатором отсутствует в системе');
}
  await apiContext.dispose();
});
