import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Добавляем конкретному пользователю роли', async () => {
  
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});
  
  const userId = 143;
  const requestBody = { // Закидываем тело запроса
    "roleIds": [4]
};
  // Передаём тело запроса в параметрах patch

  const response = await apiContext.patch(`/User/${userId}/roles/add`, {data: requestBody});  // Получаем ответ методом PATCH

  console.log('Статус ответа:', response.status()); //Статус ответа сервера

  const data = await response.json(); //Кладем наш ответ в виде JSON
  console.log('Пользователь:', util.inspect(data.result, { depth: null, colors: true }));
  expect(data).toHaveProperty('isSuccess', true);
  data.result.roles.forEach(roleItem => {
  console.log("Присвоена роль", roleItem.role.id, roleItem.role.description)});
  await apiContext.dispose();
});
