import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем информацию о пользователях и их активностях', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState, // Передаем куки из нашего файла
  });

  const response = await apiContext.get(`/User/activities`); // Дергаем ручку Гет

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа
  console.log('Статус ответа:', response.status()); // Выводим статус
  expect(data).toHaveProperty('isSuccess', true); // Проверяем, что ответ удачный
  console.log(data)

  await apiContext.dispose();
});
