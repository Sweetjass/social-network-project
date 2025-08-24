import { test,expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;

test('Создаем роль на основе информации из групп разрешений', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState});

  const randomId = Math.floor(Math.random() * 1000000);
  const requestBody = {
    "name": `Group_${randomId}`,
    "description": "Autotest",
    "groups": [
      {
        "groupType": 6,
        "enabledPermissions": [108, 115]
      }
    ]
  }
  // Передаём тело запроса в параметрах post
  const response = await apiContext.post('/Role/groups', {data: requestBody});

  console.log('Статус ответа:', response.status());

  const data = await response.json();

  expect(data.result.role.name).toBe(requestBody.name);
  expect(data.result.role.description).toBe(requestBody.description);

  console.log('Ответ:', util.inspect(data.result, { depth: null, colors: true }));
  console.log("Создана роль", data.result?.role?.id, 'с названием:', data.result.role.name);
  await apiContext.dispose();
});
