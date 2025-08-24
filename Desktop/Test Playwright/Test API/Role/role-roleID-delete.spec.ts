import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Удаляет роль по RoleID', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const roleId = 33; // Сюда кладем нужный ID роли

  const response = await apiContext.delete(`/Role/${roleId}`); // Дергаем ручку Дилит с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса
  
  const data = await response.json(); // Формируем json ответа

  expect(data).toHaveProperty('isSuccess', true);

  console.log('Статус ответа:', response.status()); // Выводим статус
  console.log(data);
  
  await apiContext.dispose();
});
