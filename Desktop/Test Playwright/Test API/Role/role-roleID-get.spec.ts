import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получение роли по RoleID', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const roleId = 23; // Сюда кладем нужный ID

  const response = await apiContext.get(`/Role/${roleId}`); // Дергаем ручку Гет с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса

  const data = await response.json(); // Формируем json ответа

  expect(data.isSuccess).toBe(true);
  expect(data).toHaveProperty('result');

  // Проверяем структуру role
  const role = data.result.role;
  expect(role).toHaveProperty('id');
  expect(role).toHaveProperty('name');
  expect(role).toHaveProperty('description');
  console.log('Статус ответа:', response.status()); // Выводим статус

  if (!data.result) { // Здесь ставим условие, что если в ответе нет нужных полей, то роль не найдена
    console.log('Роль не найдена');

  } else {
    console.log('Роль:', util.inspect(data, { depth: null, colors: true }))};
  await apiContext.dispose();
});
