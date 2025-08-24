import { test, expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;
//const extraHTTPHeaders = {accept: process.env.ACCEPT, 'Content-Type': process.env.CONTENT_TYPE};
test('Создаем новую роль', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState});
  const randomId = Math.floor(Math.random() * 1000000);
  const requestBody = {
        "name": `AutotestRole_${randomId}`,
        "description": "Роль для теста",
        "permissions": [1, 2, 4]
      };

  // Передаём тело запроса в параметрах post
  const response = await apiContext.post('/Role', {data: requestBody});

  console.log('Статус ответа:', response.status());

  const data = await response.json();

  expect(data.result.role.name).toBe(requestBody.name);
  expect(data.result.role.description).toBe(requestBody.description);
  expect(data.result.permissions).toEqual(expect.arrayContaining(requestBody.permissions));
  
  console.log('Ответ:', util.inspect(data, { depth: null, colors: true }));
  //console.log("Роль", data.result?.role?.id, 'Разрешения:', data.result.role.name);
  await apiContext.dispose();
});
