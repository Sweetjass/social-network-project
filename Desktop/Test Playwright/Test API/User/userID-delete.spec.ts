import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('API запрос на УДАЛЕНИЕ пользователя', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState, // Передаем куки из нашего файла
  });

  const userId = 122; // <---- Сюда кладем нужный ID

  const response = await apiContext.delete(`/User/${userId}`); // Дергаем ручку Delete с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа
  console.log('Статус ответа:', response.status()); // Выводим статус

  expect(data).toHaveProperty('isSuccess', true); // Проверяем, что ответ удачный
  console.log(data)
  console.log('Пользователь', userId, 'успешно удален.') //Выводим всю информацию об удалении пользователя
  await apiContext.dispose();
});
