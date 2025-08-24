import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем все роли с информацией о группах разрешений', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const response = await apiContext.get('/Role/groups'); // Дергаем ручку Гет с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа
  
  expect(data).toHaveProperty('result');
  expect(Array.isArray(data.result)).toBe(true);

  for (const roleItem of data.result) {
    expect(roleItem).toHaveProperty('role');
    expect(roleItem.role).toHaveProperty('id');
    expect(roleItem.role).toHaveProperty('name');
    expect(roleItem.role).toHaveProperty('description');

    expect(roleItem).toHaveProperty('groups');
    expect(Array.isArray(roleItem.groups)).toBe(true);

    for (const group of roleItem.groups) {
      expect(group).toHaveProperty('groupType');
      expect(group).toHaveProperty('enabledPermissions');
      expect(Array.isArray(group.enabledPermissions)).toBe(true);
    }
  }
  console.log('Статус ответа:', response.status()); // Выводим статус
  console.log('Роли:', util.inspect(data.result, { depth: null, colors: true }));
  await apiContext.dispose();
});
