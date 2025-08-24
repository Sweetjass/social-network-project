import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Создаем клиента', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const randomId = Math.floor(Math.random() * 1000000);
  const requestBody = {
    "name": `TestClient_${randomId}`,
    "clientId": `${randomId}`,
    "allowedCorsOrigins": ["AutoTestClientDeletePlease"]
  };

  // Передаём тело запроса в параметрах post
  const response = await apiContext.post('/Client', {data: requestBody});

  console.log('Статус ответа:', response.status());

  const data = await response.json();
  
  expect(data).toHaveProperty('result'); // Проверяем, что в ответе есть поле result
  expect(data.result).toMatchObject({ // Проверяем, что result содержит ожидаемые поля
    name: requestBody.name,
    clientId: requestBody.clientId,
    allowedCorsOrigins: requestBody.allowedCorsOrigins
  });
  expect(data.result.id).toBeTruthy();
  console.log('Ответ:', util.inspect(data.result, { depth: null, colors: true }));
  console.log('Создан клиент с ID', data.result.id)
  await apiContext.dispose();
});
