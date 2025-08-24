import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Обновляет роль', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const roleId = 82
  const requestBody = {
  "newName": "Группа разрешений",
  "newDescription": "Новое описание для группы разрешений",
  "permissions": [1,121]
};

  // Передаём тело запроса в параметрах put
  const response = await apiContext.put(`/Role/${roleId}`, {data: requestBody});

  console.log('Статус ответа:', response.status());

  const data = await response.json();
  
  expect(data.result.role.name).toBe(requestBody.newName);
  expect(data.result.role.description).toBe(requestBody.newDescription);
  expect(data.result.permissions).toEqual(expect.arrayContaining(requestBody.permissions));

  console.log('Ответ:', util.inspect(data, { depth: null, colors: true }));
  console.log("Обновлена роль ID", data.result?.role?.id, 'Новое название:', data.result.role.name);
  await apiContext.dispose();
});
