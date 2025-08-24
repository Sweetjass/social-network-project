import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Разблокируем конкретного пользователя', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const userId = 34; // <--- Сюда кладем нужный ID

  const response = await apiContext.patch(`/User/${userId}/unblock`); // Дергаем ручку patch с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса
  
  const data = await response.json(); // Формируем json ответа

  console.log('Статус ответа:', response.status()); // Выводим статус
  expect(data).toHaveProperty('isSuccess', true); // Проверяем, что ответ удачный
  console.log(data)
  console.log('Пользователь', userId, '-', data.result.user.userName, 'разблокирован.') //Выводим всю информацию о разблокировке пользователя
  await apiContext.dispose();
});
