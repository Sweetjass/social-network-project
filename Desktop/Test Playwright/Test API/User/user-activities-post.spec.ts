import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Обновляем информацию об активности для списка пользователей', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState
  });

  const requestBody = [{
    "user": {
      "id": 15,
      "userId": "user:00000000-0000-0000-0000-000000000012",
      "userName": "Тестовый пользователь 12",
      "status": 1,
    },
    "lastActivityDate": "2025-05-31T22:09:14.315Z",
    "lastLoginDate": "2025-05-31T22:09:14.315Z",
    "lastLogoutDate": "2025-05-31T22:09:14.315Z"
}];

  // Передаём тело запроса в параметрах post
  const response = await apiContext.post('/User/activities', {data: requestBody});

  console.log('Статус ответа:', response.status());
  
  const data = await response.json();
  
  expect(data).toHaveProperty('isSuccess', true);
  if (!response.ok()) {
  console.error('Ошибка при обновлении активности пользователей:', await response.text());
}
  console.log('Ответ сервера:', JSON.stringify(data, null, 2));
  await apiContext.dispose();
});
