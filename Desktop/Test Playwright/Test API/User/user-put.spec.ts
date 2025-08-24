import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Отправка PUT запроса с JSON телом', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const randomId = Math.floor(Math.random() * 1000000);
  const requestBody = {
  "id": 144,  // СЮДА ВПИСЫВАЕМ ID
  "userName": "Тамерланчик",
  "firstName": `${randomId}`,
  "lastName": "Пёс",
  "middleName": "Асуддовский",
  "email": "tamerlanchik@mail.ru",
  "oauthName": `${randomId}`,
  "roleIds": [2]
}
  // Передаём тело запроса в параметрах put
  const response = await apiContext.put('/User', {data: requestBody});

  console.log('Статус ответа:', response.status());

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  
  expect(data).toHaveProperty('result');
  expect(data.result).toHaveProperty('user');
  
  const user = data.result.user;
  
  expect(user).toHaveProperty('id');
  expect(user.id).toBe(requestBody.id);
  expect(user.userName).toBe(requestBody.userName);
  expect(user.firstName).toBe(requestBody.firstName);
  expect(user.lastName).toBe(requestBody.lastName);
  expect(user.middleName).toBe(requestBody.middleName);

  console.log('Ответ:', util.inspect(data.result, { depth: null, colors: true }));
  await apiContext.dispose();
});
