import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Удаляем клиента', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const userId = 9;
  const response = await apiContext.delete(`/Client/${userId}`); // Дергаем ручку delete с нужным userID

  const data = await response.json(); // Формируем json ответа

  expect(data).toHaveProperty('isSuccess', true);
  console.log(`Удален клиент с id ${userId}`)

  await apiContext.dispose();
});
