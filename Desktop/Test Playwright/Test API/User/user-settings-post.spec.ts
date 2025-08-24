import { test, request, expect } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Задаем или обновляем настройки пользователя', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const requestBody = [{
    "id": 30,
    "autoBlocking": false
  }];

  // Передаём тело запроса в параметрах post
  const response = await apiContext.post('/User/settings', {data: requestBody});

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа
  console.log('Статус ответа:', response.status()); // Выводим статус
  expect(data).toHaveProperty('isSuccess', true); // Проверяем, что ответ удачный
  console.log(data)
 
  await apiContext.dispose();
});
