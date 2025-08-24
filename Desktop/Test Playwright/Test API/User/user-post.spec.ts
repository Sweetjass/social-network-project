import { test, expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;

test('Создаем пользователя', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState});

  const randomId = Math.floor(Math.random() * 1000000);
  const requestBody = {
    userId: `${randomId}`,
    userName: `testUser_${randomId}`,
    firstName: "Test",
    lastName: "User",
    middleName: "QA",
    email: "TestUser@mail.ru",
    oauthName: "corp",
    roleIds: [6]
  };

  // Передаём тело запроса в параметрах post
  const response = await apiContext.post('/User', {data: requestBody});

  console.log('Статус ответа:', response.status());

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const data = await response.json();

  expect(data).toHaveProperty('result');
  expect(data.result).toHaveProperty('user');

  const user = data.result.user;

  expect(user).toHaveProperty('id');
  expect(user.userId).toBe(requestBody.userId);
  expect(user.userName).toBe(requestBody.userName);
  expect(user.firstName).toBe(requestBody.firstName);
  expect(user.lastName).toBe(requestBody.lastName);
  expect(user.middleName).toBe(requestBody.middleName);

  console.log('Ответ:', util.inspect(data.result, { depth: null, colors: true }));

  //console.log("Создан пользователь c ID", data.result?.user?.id, 'userName:', data.result.user.userName);
  await apiContext.dispose();
});
