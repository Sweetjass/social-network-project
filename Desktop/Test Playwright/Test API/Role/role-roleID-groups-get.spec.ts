import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получение роли с информацией о группах разрешений', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const roleId = 4; // Сюда кладем нужный ID

  const response = await apiContext.get(`/Role/${roleId}/groups`); // Дергаем ручку Гет с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа
  console.log('Статус ответа:', response.status()); // Выводим статус

  // Проверяем структуру role
      expect(data.result).toHaveProperty('role');
      expect(data.result.role).toHaveProperty('id', roleId);
      expect(data.result.role).toHaveProperty('name');
      expect(data.result.role).toHaveProperty('description');
      
      // Проверяем группы
      expect(data.result).toHaveProperty('groups');
      expect(Array.isArray(data.result.groups)).toBe(true);
      
      for (const group of data.result.groups) {
        expect(group).toHaveProperty('groupType');
        expect(group).toHaveProperty('enabledPermissions')};

  if (!data.result) { // Здесь ставим условие, что если в ответе нет нужных полей, то роль не найдена
    console.log('Роль не найдена');

  } else {
    console.log('Роль:', util.inspect(data, { depth: null, colors: true }))};
  await apiContext.dispose();
});
