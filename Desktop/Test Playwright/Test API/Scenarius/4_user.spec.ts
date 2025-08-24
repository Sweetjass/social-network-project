import { test, expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;

test('Тест кейс по пользователям 1', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState});

  console.log('\x1b[33m%s\x1b[0m','Шаг 1. Создаем пользователя...')

//~~~~~~~~~~~~~~~~~~ Step 1  Создать пользователя ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const randomId = Math.floor(Math.random() * 100);
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

  let response = await apiContext.post('/User', {data: requestBody});
  let data = await response.json(); // парсим ответ

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true); // проверяем успешность запроса

  let user = data.result.user;

  expect(user).toHaveProperty('id'); 
  expect(user.userId).toBe(requestBody.userId);
  expect(user.userName).toBe(requestBody.userName);
  expect(user.firstName).toBe(requestBody.firstName);
  expect(user.lastName).toBe(requestBody.lastName);
  expect(user.middleName).toBe(requestBody.middleName);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status()); // нам все же нужен статус ответа

  const userId = data.result.user.id // кладем id из ответа в переменную

  console.log('\x1b[36m%s\x1b[0m', `Пользователь успешно создан, присвоен id: ${userId}.`); // прохождение первого шага
  console.log('Вводные данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 2  Проверить данные ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 2. Проверяем информацию о создананном пользователе в системе...');

  response = await apiContext.get(`/User/${userId}`); // Дергаем ручку Гет с нужным ID
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true); // проверяем успешность запроса
  user = data.result.user;
  expect(user).toHaveProperty('id'); 
  expect(user.userId).toBe(requestBody.userId);
  expect(user.userName).toBe(requestBody.userName);
  expect(user.firstName).toBe(requestBody.firstName);
  expect(user.lastName).toBe(requestBody.lastName);
  expect(user.middleName).toBe(requestBody.middleName);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m','Пользователь обнаружен в системе. Данные соответствуют вводным.')
  console.log('Пользователь:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 3  Обновить пользователя ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m','Шаг 3. Поробуем обновить данные пользователя...')

  const requestBody2 = {
    id: userId,  // СЮДА ВПИСЫВАЕМ ID
    userId: `${randomId}`,
    userName: `UPD_testUser_${randomId}`,
    firstName: "PUT_Test",
    lastName: "UPD_User",
    middleName: "QA",
    email: "TestUser@mail.ru",
    oauthName: "corp",
    roleIds: [84]
  };

  response = await apiContext.put('/User', {data: requestBody2});
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  if (data.isSuccess === false) {
  console.error('Ошибка обновления пользователя:', util.inspect(data, { depth: null, colors: true }));
  };
  user = data.result.user;
  expect(user).toHaveProperty('id');
  expect(user.id).toBe(requestBody2.id);
  expect(user.userId).toBe(requestBody2.userId);
  expect(user.userName).toBe(requestBody2.userName);
  expect(user.firstName).toBe(requestBody2.firstName);
  expect(user.lastName).toBe(requestBody2.lastName);
  expect(user.middleName).toBe(requestBody2.middleName);

//-------------------------Выводы--------------------------------------------

  console.log('\x1b[36m%s\x1b[0m',`Пользователь с id ${userId} успешно обновлен.`);
  console.log('Новые данные:', util.inspect(data.result, { depth: null, colors: true }));
 
//~~~~~~~~~~~~~~~~~~ Step 4  Проверить обновление пользователя по внешнему ID  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 4. Проверяем обновление информации в системе по внешнему идентификатору...');

  response = await apiContext.get(`/User/byUserId?userId=${randomId}`); // Дергаем ручку Гет с нужным ВНЕШНИМ ID
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data).toHaveProperty('isSuccess', true);
  user = data.result.user;
  expect(user).toHaveProperty('id');
  expect(user.userId).toBe(requestBody2.userId);
  expect(user.userName).toBe(requestBody2.userName);
  expect(user.firstName).toBe(requestBody2.firstName);
  expect(user.lastName).toBe(requestBody2.lastName);
  expect(user.middleName).toBe(requestBody2.middleName);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', 'Данные обновленного пользователя найдены в системе по внешнему ID.');
  console.log('Новые данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 5 Добавить роли пользователю ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 5. Попробуем добавить пользователю несколько ролей...');

  const requestBody3 = { // Закидываем тело запроса
    "roleIds": [41,42]
  };

  response = await apiContext.patch(`/User/${userId}/roles/add`, {data: requestBody3});
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200); // Проверяем статус запроса
  expect(data).toHaveProperty('isSuccess', true);
  
//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Добавлены роли ${requestBody3.roleIds} для пользователя с id ${userId}.`);
  console.log('Новые данные по пользователю:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 6 Удалить ненужные роли ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 6. Теперь удалим какую-нибудь роль...');

  const requestBody4 = {
    "roleIds": [84]
  };

  response = await apiContext.patch(`/User/${userId}/roles/remove`, {data: requestBody4});
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200); // Проверяем статус запроса
  expect(data).toHaveProperty('isSuccess', true);
  
//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Удалена роль ${requestBody4.roleIds} для пользователя с id ${userId}.`);
  console.log('Данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 7 Проверить данные ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 7. Проверяем что информация о добавленных и удаленых ролях появилась в системе...');
  response = await apiContext.get(`/User/${userId}`);
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  const userRoleIds = data.result.roles.map(r => r.role.id);
  expect(userRoleIds).toEqual(expect.arrayContaining(requestBody3.roleIds)); // Проверяем, что добавленные роли из requestBody3.roleIds присутствуют
  requestBody4.roleIds.forEach(roleId => { // Проверяем, что удалённые роли из requestBody4.roleIds отсутствуют
    expect(userRoleIds).not.toContain(roleId);
});

//-------------------------Выводы--------------------------------------------

console.log('\x1b[36m%s\x1b[0m', 'Список ролей после внесенных изменений соответствует ожидаемому:', userRoleIds);

console.log('Роли пользователя:', util.inspect(data.result.roles, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 8 Блокируем пользователя ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 8. Проверяем функцию блокировки пользователя...');

  response = await apiContext.patch(`/User/${userId}/block`);
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200); 
  expect(data).toHaveProperty('isSuccess', true);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователь с id ${userId} успешно заблокирован`);
  console.log('Статус выполнения:', util.inspect(data.isSuccess, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 9 Разблокировка пользователя ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 9. Проверяем функцию разблокировки пользователя...');

  response = await apiContext.patch(`/User/${userId}/unblock`);
  data = await response.json(); // Формируем json ответа

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data).toHaveProperty('isSuccess', true);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователь с id ${userId} успешно разблокирован`);
  console.log('Статус выполнения:', util.inspect(data.isSuccess, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 10 Удаление пользователя ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 10. Удаляем пользователя...');

  response = await apiContext.delete(`/User/${userId}`);
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data).toHaveProperty('isSuccess', true);
  expect(data).toHaveProperty('result', userId);
  expect(data.errorResult.length).toBe(0);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователь с id ${userId} удален из системы`);
  console.log('Ответ:', util.inspect(data, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 11 Проверка отсутствия пользователя в системе ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 11. Проверка отсутствия пользователя в системе...');

  response = await apiContext.get(`/User/${userId}`);;
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data).toHaveProperty('isSuccess', true);
  expect(Array.isArray(data.result.roles)).toBe(true);
  expect(data.result.roles.length).toBe(0);    // Ролей нет
  expect(data.result).not.toHaveProperty('user'); // Данных о пользователе нет
  expect(Array.isArray(data.errorResult)).toBe(true);
  expect(data.errorResult.length).toBe(0) // Также проверим, что ошибок нет

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователь с id ${userId} не найден в системе по идентификатору`);
  console.log('Ответ:', util.inspect(data, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 12 Проверка отсутствия пользователя в системе ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  console.log('\x1b[33m%s\x1b[0m', 'Шаг 12. Проверка отсутствия данных удаленного пользователя в списке имеющихся пользователей...');

  const params = new URLSearchParams({ 
    //UserIds: 'int'
    //RoleIds: 'int',          // Фильтр по идентификатору ролей у пользователя
    //NoRoles: 'boolean',        // Фильтр по отсутствию ролей у пользователя: true - только пользователи у которых нет роли(ей); false - только пользователи у которых есть роль(и); null - поиск вне зависимости от наличие роли у пользователя
    Search: `${requestBody2.userName}`,        // Производит поиск по имени/фамилии пользователя
    //PageIndex: '1',         // Номер страницы
    //PageSize: '4',         // Количество записей на страницу
  });

  response = await apiContext.get(`/User?${params.toString()}`);
  data = await response.json();

//---------------------------Проверки----------------------------------------
try {
  expect(response.status()).toBe(200);
  expect(data).toHaveProperty('isSuccess', true);
  expect(data).toHaveProperty('result');
  expect(data.result).toHaveProperty('pageIndex');
  expect(data.result).toHaveProperty('pageSize');
  expect(data.result).toHaveProperty('totalCount');
  expect(Array.isArray(data.result.items)).toBe(true);
  expect(data.result.items.length).toBe(0);
  expect(Array.isArray(data.errorResult)).toBe(true);
  expect(data.errorResult.length).toBe(0);

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Пользователь с именем ${requestBody2.userName} не найден в системе по username. Тестовый сценарий пройден успешно.`);
  console.log('URL запроса:', response.url());
  console.log('Ответ:', util.inspect(data, { depth: null, colors: true }));

} catch (error) {

  console.log('Пользователь найден:', util.inspect(data, { depth: null, colors: true }));
  throw error; 
}

await apiContext.dispose();
});
