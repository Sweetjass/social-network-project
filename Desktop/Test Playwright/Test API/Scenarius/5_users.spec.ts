import { test, expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;

test('Тест кейс по пользователям 2', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState});

  console.log('\x1b[33m%s\x1b[0m','Шаг 1. Создаем пользователей...')

//~~~~~~~~~~~~~~~~~~ Step 1  Создать пользователей ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const randomId = Math.floor(Math.random() * 1000);
  const randomId2= Math.floor(Math.random() * 1000);
  const requestBody = {
    userId: `${randomId}`,
    userName: `test1_${randomId}`,
    firstName: "user1",
    lastName: "belka",
    middleName: "Mega1",
    email: "TestUsersQA1@mail.ru",
    oauthName: "corp",
    roleIds: []
  };
  const requestBody1 = {
    userId: `${randomId2}`,
    userName: `test2_${randomId2}`,
    firstName: "user2",
    lastName: "strelka",
    middleName: "Mega2",
    email: "TestUsersQA2@mail.ru",
    oauthName: "corp",
    roleIds: []
  };

  let response = await apiContext.post('/User', {data: requestBody});
  let response1 = await apiContext.post('/User', {data: requestBody1});
  let data = await response.json(); // парсим ответ
  let data1 = await response1.json(); // парсим ответ
//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true); // проверяем успешность запроса
  expect(data1.isSuccess).toBe(true);

  let user = data.result.user;
  let user1 = data1.result.user;

  expect(user).toHaveProperty('id'); 
  expect(user.userId).toBe(requestBody.userId);
  expect(user.userName).toBe(requestBody.userName);
  expect(user.firstName).toBe(requestBody.firstName);
  expect(user.lastName).toBe(requestBody.lastName);
  expect(user.middleName).toBe(requestBody.middleName);

  expect(user1).toHaveProperty('id'); 
  expect(user1.userId).toBe(requestBody1.userId);
  expect(user1.userName).toBe(requestBody1.userName);
  expect(user1.firstName).toBe(requestBody1.firstName);
  expect(user1.lastName).toBe(requestBody1.lastName);
  expect(user1.middleName).toBe(requestBody1.middleName);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());

  const userId = data.result.user.id // кладем id из ответа в переменную
  const userId1 = data1.result.user.id

  console.log('\x1b[36m%s\x1b[0m', `Пользователи успешно созданы, присвоены id: ${userId} и ${userId1}.`); // прохождение первого шага
  console.log('Вводные данные первого пользователя', util.inspect(data.result, { depth: null, colors: true }));
  console.log('Вводные данные второго пользователя', util.inspect(data1.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 2  Проверить данные ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 2. Проверяем информацию о создананных пользователях в системе...');

  response = await apiContext.get(`/User/${userId}`);
  data = await response.json();
  response1 = await apiContext.get(`/User/${userId1}`);
  data1 = await response1.json();
//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  expect(data1.isSuccess).toBe(true);
  user = data.result.user;
  user1 = data1.result.user;

  expect(user).toHaveProperty('id'); 
  expect(user.userId).toBe(requestBody.userId);
  expect(user.userName).toBe(requestBody.userName);
  expect(user.firstName).toBe(requestBody.firstName);
  expect(user.lastName).toBe(requestBody.lastName);
  expect(user.middleName).toBe(requestBody.middleName);

  expect(user1).toHaveProperty('id'); 
  expect(user1.userId).toBe(requestBody1.userId);
  expect(user1.userName).toBe(requestBody1.userName);
  expect(user1.firstName).toBe(requestBody1.firstName);
  expect(user1.lastName).toBe(requestBody1.lastName);
  expect(user1.middleName).toBe(requestBody1.middleName);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m','Пользователи обнаружены в системе. Данные соответствуют вводным.')
  console.log('Пользователь 1:', util.inspect(data.result, { depth: null, colors: true }));
  console.log('Пользователь 2:', util.inspect(data1.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 3 Добавить роли пользователю ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 3. Попробуем добавить пользователям несколько ролей...');

  const requestBody2 = {
  "userIdRolePairs": [
    {
      "userId": userId,
      "roleIds": [58, 122]
    },
    {
      "userId": userId1,
      "roleIds": [58, 122]
    }
  ]
};

  const response3 = await apiContext.patch('/User/roles/add', {data: requestBody2});
  const data3 = await response3.json();

//---------------------------Проверки----------------------------------------

  expect(response3.status()).toBe(200); // Проверяем статус запроса
  expect(data3).toHaveProperty('isSuccess', true);
  
//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  for (const pair of requestBody2.userIdRolePairs) {
  console.log('\x1b[36m%s\x1b[0m', `Добавлены роли ${pair.roleIds} для пользователя с id ${pair.userId}.`);
}

  console.log('Новые данные по пользователям:', util.inspect(data3.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 4 Удалить одну из ролей  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 4. Удалим одну из ролей пользователей...');

  const requestBody3 = {
    "userIdRolePairs": [
    {
      "userId": userId,
      "roleIds": [122]
    },
    {
      "userId": userId1,
      "roleIds": [58]
    }
  ]
};

  const response4 = await apiContext.patch(`/User/roles/remove`, {data: requestBody3});
  const data4 = await response4.json();

//---------------------------Проверки----------------------------------------

  expect(response4.status()).toBe(200); // Проверяем статус запроса
  expect(data4).toHaveProperty('isSuccess', true);
  
//-------------------------Выводы--------------------------------------------

  for (const pair of requestBody3.userIdRolePairs) {
  console.log('\x1b[36m%s\x1b[0m', `Удалена роль ${pair.roleIds} для пользователя с id ${pair.userId}.`);
}
  console.log('Данные:', util.inspect(data4.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 5 Проверить данные и разрешения пользователей ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 5. Проверяем обновленную информацию о пользователях в системе...');

  response = await apiContext.get(`/User/${userId}`);
  data = await response.json();
  response1 = await apiContext.get(`/User/${userId1}`);
  data1 = await response1.json();
//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  expect(data1.isSuccess).toBe(true);
  user = data.result.user;
  user1 = data1.result.user;

  expect(user).toHaveProperty('id'); 
  expect(user.userId).toBe(requestBody.userId);
  expect(user.userName).toBe(requestBody.userName);
  expect(user.firstName).toBe(requestBody.firstName);
  expect(user.lastName).toBe(requestBody.lastName);
  expect(user.middleName).toBe(requestBody.middleName);

  expect(user1).toHaveProperty('id'); 
  expect(user1.userId).toBe(requestBody1.userId);
  expect(user1.userName).toBe(requestBody1.userName);
  expect(user1.firstName).toBe(requestBody1.firstName);
  expect(user1.lastName).toBe(requestBody1.lastName);
  expect(user1.middleName).toBe(requestBody1.middleName);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m','Пользователи обнаружены в системе. Данные соответствуют вводным.')
  console.log('Пользователь 1:', util.inspect(data.result, { depth: null, colors: true }));
  console.log('Пользователь 2:', util.inspect(data1.result, { depth: null, colors: true }));
  const permissionsList = data.result.roles?.flatMap(r => r.permissions) ?? [];
  const permissionsList1 = data1.result.roles?.flatMap(r => r.permissions) ?? [];

  console.log('Permissions первого пользователя:', permissionsList);
  console.log('Permissions второго пользователя:', permissionsList1);
  

//~~~~~~~~~~~~~~~~~~ Step 6 Блокируем пользователя ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 6. Проверим соответствие разрешенений для наших пользователей...');

  const response5 = await apiContext.get(`/User/permissions`);
  const data5 = await response5.json();

//---------------------------Проверки----------------------------------------
  expect(response5.status()).toBe(200); 
  expect(data5).toHaveProperty('isSuccess', true);
  const userPerm1 = data5.result.find(u => u.user.id === userId)?.permissions ?? [];
  const userPerm2 = data5.result.find(u => u.user.id === userId1)?.permissions ?? [];
  expect(userPerm1.sort()).toEqual(permissionsList.sort());
  expect(userPerm2.sort()).toEqual(permissionsList1.sort());
  
//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response5.status());
  console.log('\x1b[36m%s\x1b[0m', 'Разрешения пользователей проверены и соответствуют ожидаемым.');
  console.log(userPerm1.sort(), userPerm2.sort(),'===', permissionsList.sort(), permissionsList1.sort());
  
//~~~~~~~~~~~~~~~~~~ Step 7 Настройка пользователя ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 7. Проверим работоспособность настроек пользователя...');

  const requestBody4 = [
  {
    "id": userId,
    "autoBlocking": false
  },
  {
    "id": userId1,
    "autoBlocking": true
  }
]

  const response6 = await apiContext.post('/User/settings', {data: requestBody4});
  const data6 = await response6.json();
//---------------------------Проверки----------------------------------------

  expect(response6.status()).toBe(200);
  expect(data6).toHaveProperty('isSuccess', true);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response6.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователям с id ${userId} и ${userId1} заданы новые настройки.`);
  console.log('Ответ сервера:', util.inspect(data6, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 8 Проверка настройки пользователей ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 8. Проверим, что настройки пользователей поменялись..');

  const response7 = await apiContext.get(`/User/settings?ids=${userId}&ids=${userId1}`); 
  const data7 = await response7.json();
//---------------------------Проверки----------------------------------------

  expect(response7.status()).toBe(200);
  expect(data7).toHaveProperty('isSuccess', true);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response7.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователям с id ${userId} и ${userId1} подтверждены новые настройки.`);
  console.log('Ответ сервера:', util.inspect(data7, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 9 Удаление пользователя ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 9. Удаляем пользователей...');

  response = await apiContext.delete(`/User/${userId}`);
  data = await response.json();
  response1 = await apiContext.delete(`/User/${userId1}`);
  data1 = await response1.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data).toHaveProperty('isSuccess', true);
  expect(data1).toHaveProperty('isSuccess', true);
  expect(data1).toHaveProperty('result', userId1);
  expect(data1.errorResult.length).toBe(0);
  expect(data).toHaveProperty('result', userId);
  expect(data.errorResult.length).toBe(0);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователи с id ${userId} и ${userId1} удалены из системы.`);
  console.log('Ответ 1:', util.inspect(data, { depth: null, colors: true }));
  console.log('Ответ 2:', util.inspect(data1, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 10 Проверка отсутствия пользователей в системе ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 10. Проверка отсутствия создаваемых пользователей в системе...');

  response = await apiContext.get(`/User/${userId}`);;
  data = await response.json();
  response1 = await apiContext.get(`/User/${userId1}`);;
  data1 = await response1.json();
//---------------------------Проверки----------------------------------------
  try {
// Пользователь 1
    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('isSuccess', true);
    expect(Array.isArray(data.result.roles)).toBe(true);
    expect(data.result.roles.length).toBe(0);    // Ролей нет
    expect(data.result).not.toHaveProperty('user'); // Данных о пользователе нет
    expect(Array.isArray(data.errorResult)).toBe(true);
    expect(data.errorResult.length).toBe(0) // Также проверим, что ошибок нет
 // Пользователь 2
    expect(response1.status()).toBe(200);
    expect(data1).toHaveProperty('isSuccess', true);
    expect(Array.isArray(data1.result.roles)).toBe(true);
    expect(data1.result.roles.length).toBe(0);    // Ролей нет
    expect(data1.result).not.toHaveProperty('user'); // Данных о пользователе нет
    expect(Array.isArray(data1.errorResult)).toBe(true);
    expect(data1.errorResult.length).toBe(0) // Также проверим, что ошибок нет

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователи с id ${userId} и ${userId1} не найдены в системе по идентификаторам.`);
  console.log('Ответ 1:', util.inspect(data, { depth: null, colors: true }));
  console.log('Ответ 2:', util.inspect(data1, { depth: null, colors: true }));
  } catch (error) {

  console.log('Пользователь найден:', util.inspect(data, { depth: null, colors: true }));
  throw error; 
  }

await apiContext.dispose();
});
