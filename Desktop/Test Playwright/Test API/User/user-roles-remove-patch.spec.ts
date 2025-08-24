import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Удаляем роли пользователям', async () => {
  
    const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState
  });

  const requestBody = {
    
  "userIdRolePairs": [
    {
      "userId": 144,  //  <--- Вставляем ID пользователей которым стираем роли
      "roleIds": [3]  // <--- Вставляем ID роли, которую хотим убрать
    }
  ]
};
  // Передаём тело запроса в параметрах patch

  const response = await apiContext.patch('/User/roles/remove', {data: requestBody});  // Получаем ответ методом PATCH

  console.log('Статус ответа:', response.status()); //Статус ответа сервера

  const data = await response.json(); //Кладем наш ответ в виде JSON
  expect(data).toHaveProperty('isSuccess', true);
  console.log('Ответ:', util.inspect(data.result, { depth: null, colors: true }));

  await apiContext.dispose();
});
