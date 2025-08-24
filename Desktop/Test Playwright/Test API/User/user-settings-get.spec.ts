import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем настройки пользователей', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const params = new URLSearchParams({  //Квери параметры раскоментить для выбора фильтров
    Ids: 'int'
  });
  const response = await apiContext.get(`/User/settings?${params.toString()}`); // Дергаем ручку Гет

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа
  console.log('Статус ответа:', response.status()); // Выводим статус
  expect(data).toHaveProperty('isSuccess', true); // Проверяем, что ответ удачный
  console.log(data)

  await apiContext.dispose();
});
