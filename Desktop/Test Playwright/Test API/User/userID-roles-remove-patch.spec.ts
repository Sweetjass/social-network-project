import { test, request, expect } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Удаляем роли конкретному пользователю', async () => {
  
    const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});
  const userId = 34
  const requestBody = { // Закидываем тело запроса
      "roleIds": [4] // <----- Сюда ID роли
};
  // Передаём тело запроса в параметрах patch

  const response = await apiContext.patch(`/User/${userId}/roles/remove`, {data: requestBody});  // Получаем ответ методом PATCH

  console.log('Статус ответа:', response.status()); //Статус ответа сервера
  const data = await response.json(); //Кладем наш ответ в виде JSON

  console.log('Пользователь:', util.inspect(data.result, { depth: null, colors: true }));
  expect(data).toHaveProperty('isSuccess', true);
  data.result.roles.forEach(roleItem => {
  console.log("Оставшиеся роли:", roleItem.role.id, roleItem.role.description);
});
  await apiContext.dispose();
});
