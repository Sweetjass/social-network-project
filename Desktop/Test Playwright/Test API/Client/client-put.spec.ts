import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Обновляем клиента', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});
  const randomId = Math.floor(Math.random() * 1000000);
  const requestBody = {
    "id": 10,
    "name": `TestClient_${randomId}`,
    "clientId": `${randomId}`,
    "allowedCorsOrigins": ["delete"]
  };

  // Передаём тело запроса в параметрах put
  const response = await apiContext.put('/Client', {data: requestBody});

  console.log('Статус ответа:', response.status());

  const data = await response.json();
  
  expect(data).toHaveProperty('result'); // Проверяем, что в ответе есть поле result
  expect(data.result).toMatchObject({ // Проверяем, что result содержит обновленные данные
    id: requestBody.id,
    name: requestBody.name,
    clientId: requestBody.clientId,
    allowedCorsOrigins: requestBody.allowedCorsOrigins
  });
  console.log('Пользователь обновлен. Новые данные:', util.inspect(data.result, { depth: null, colors: true }));

  await apiContext.dispose();
});
