import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Добавляем разрешения к роли', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const roleId = 82; // <--- Сюда кладем нужный ID
  const requestBody = {
    "permissions": [1]};
  
  const response = await apiContext.patch(`/Role/${roleId}/permissions/add`, {data: requestBody}); // Дергаем ручку patch с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса

  const data = await response.json(); // Формируем json ответа

  console.log('Статус ответа:', response.status()); // Выводим статус

  expect(data).toHaveProperty('isSuccess', true); // Проверяем, что ответ удачный

  console.log(data)
  
  await apiContext.dispose();
});
