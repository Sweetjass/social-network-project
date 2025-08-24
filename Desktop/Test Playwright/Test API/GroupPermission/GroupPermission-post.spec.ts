import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Создаем группу разрешений', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const requestBody = {
  "groupType": 20,
  "permissions": [122, 123]
};

  // Передаём тело запроса в параметрах post
  const response = await apiContext.post('/GroupPermission', {data: requestBody});

  console.log('Статус ответа:', response.status());

  const data = await response.json();

  expect(data.result).toHaveProperty('groupType', requestBody.groupType);
  expect(data.result).toHaveProperty('permissions');
  expect(data.result.permissions).toEqual(expect.arrayContaining(requestBody.permissions));
  console.log('Ответ API:', data)
  //console.log("Создан пользователь c ID", data.result?.user?.id, 'userName:', data.result.user.userName);
  await apiContext.dispose();
});
