import { test, expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;

test('Получаем информацию о текущем пользователе с ролями', async () => {
  const apiContext = await request.newContext({ baseURL, storageState });

  const response = await apiContext.get('/User/myUser');

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const data = await response.json();

  expect(data).toHaveProperty('isSuccess', true);
  expect(data).toHaveProperty('result');
  expect(data.result).toHaveProperty('user');
  expect(data.result).toHaveProperty('roles');

  const user = data.result.user;

  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('userName');
  expect(user).toHaveProperty('email');

  // Дополнительно можно проверить роли
  expect(Array.isArray(data.result.roles)).toBe(true);
  data.result.roles.forEach(roleItem => {
    expect(roleItem).toHaveProperty('role');
    expect(roleItem.role).toHaveProperty('id');
    expect(roleItem.role).toHaveProperty('name');
    expect(roleItem).toHaveProperty('permissions');
    expect(Array.isArray(roleItem.permissions)).toBe(true);
  });

  console.log('Статус ответа:', response.status());
  console.log('Данные пользователя:', util.inspect(data.result, { depth: null, colors: true }));

  await apiContext.dispose();
});
