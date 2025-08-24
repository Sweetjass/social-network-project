import { test, request, expect } from '@playwright/test';
import { getDateOffsetFormatted } from '../utils/dateUtils';
import { checkAndPrintEvents } from '../utils/eventUtils';
import chalk from 'chalk';
import util from 'util'
require('dotenv').config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;
const formatDateOnly = s => new Date(s).toLocaleDateString('ru-RU');
test('Тест событий безопасности и других данных', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState,
  });

  const startDate = getDateOffsetFormatted(0);
  const finishDate = getDateOffsetFormatted(1);

  console.log(chalk.yellow('Шаг 1. Проверяем вывод событий в соответствии с типом эвента'))

  await checkAndPrintEvents(
    apiContext,
    new URLSearchParams({
      Start: startDate,
      Finish: finishDate,
      PageIndex: '1',
      PageSize: '20',
      EventTypes: '1',
    }),
    'Создан новый пользователь',
    'Проверка события создания пользователя...'
  );

  await checkAndPrintEvents(
    apiContext,
    new URLSearchParams({
      Start: startDate,
      Finish: finishDate,
      PageIndex: '1',
      PageSize: '20',
      EventTypes: '5',
    }),
    'Обновлен пользователь',
    'Проверка события обновления пользователя'
  );

  await checkAndPrintEvents(
    apiContext,
    new URLSearchParams({
      Start: startDate,
      Finish: finishDate,
      PageIndex: '1',
      PageSize: '20',
      EventTypes: '2',
    }),
    'Добавлена роль(и) у пользователя',
    'Проверка события добавления ролей пользователю...'
  );

  await checkAndPrintEvents(
    apiContext,
    new URLSearchParams({
      Start: startDate,
      Finish: finishDate,
      PageIndex: '1',
      PageSize: '20',
      EventTypes: '3',
    }),
    'Удалены роль(и) у пользователя',
    'Проверка события удаления ролей...'
  );

  await checkAndPrintEvents(
    apiContext,
    new URLSearchParams({
      Start: startDate,
      Finish: finishDate,
      PageIndex: '1',
      PageSize: '20',
      EventTypes: '4',
    }),
    'Удален пользователь',
    'Проверка событий удаления пользователей...'
  );

//------------------ Шаг 2. Проверка енамов permissionType -------------------------

  console.log();
  console.log(chalk.yellow('Шаг 2. Проверяем вывод енамов permissionType'))
  console.log();

  const response = await apiContext.get('Enum/permissionType');
  const data = await response.json();
    

  expect(data.isSuccess).toBe(true);
  expect(Array.isArray(data.result)).toBe(true);

  const count = data.result.length;
  const values = data.result.map((item: any) => item.value);

  for (const item of data.result) {
    expect(item).toHaveProperty('value');
    expect(typeof item.value).toBe('number');

    expect(item).toHaveProperty('rawDescription');
    expect(typeof item.rawDescription).toBe('string');
    expect(item.rawDescription.trim().length).toBeGreaterThan(0);

    expect(item).toHaveProperty('description');
    expect(typeof item.description).toBe('string');
    expect(item.description.trim().length).toBeGreaterThan(0);
  }
    console.log('Статус ответа:', response.status()); // Выводим статус 
    console.log();
    console.log(chalk.cyan('Значения Enum', util.inspect(values, {depth: null, colors: true})));
    console.log(chalk.cyan('Количество элементов:', count));
    console.log(chalk.cyan('Запрос permissionType проверен. Поля не пустые.'));

//----------------Шаг 3. Проверка Enum по группам -------------------------------

  console.log();
  console.log(chalk.yellow('Шаг 3. Проверяем вывод енамов groupPermissionType'))
  console.log();

  const response1 = await apiContext.get('Enum/groupPermissionType');
  const data1 = await response1.json();
    

  expect(data1.isSuccess).toBe(true);
  expect(Array.isArray(data1.result)).toBe(true);

  const count1 = data1.result.length;
  const values1 = data1.result.map((item: any) => item.value);

  for (const item of data1.result) {
    expect(item).toHaveProperty('value');
    expect(typeof item.value).toBe('number');

    expect(item).toHaveProperty('rawDescription');
    expect(typeof item.rawDescription).toBe('string');
    expect(item.rawDescription.trim().length).toBeGreaterThan(0);

    expect(item).toHaveProperty('description');
    expect(typeof item.description).toBe('string');
    expect(item.description.trim().length).toBeGreaterThan(0);
  }
    console.log('Статус ответа:', response1.status()); // Выводим статус 
    console.log();
    console.log(chalk.cyan('Значения Enum', util.inspect(values1, {depth: null, colors: true})));
    console.log(chalk.cyan('Количество элементов:', count1));
    console.log(chalk.cyan('Запрос groupPermissionType проверен. Поля не пустые.'));

//--------------------Шаг 4. Проверка информации о текущем пользователе -------------------

  console.log();
  console.log(chalk.yellow('Шаг 4. Получаем информацию о своем пользователе'))
  console.log();

  const response2 = await apiContext.get('/User/myUser');
  const data2 = await response2.json();

  expect(response2.status()).toBe(200);
  expect(response2.ok()).toBeTruthy();
  expect(data2).toHaveProperty('isSuccess', true);
  expect(data2).toHaveProperty('result');
  expect(data2.result).toHaveProperty('user');
  expect(data2.result).toHaveProperty('roles');

  const user = data2.result.user;

  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('userName');
  expect(user).toHaveProperty('email');
  const id = user.id
  expect(Array.isArray(data2.result.roles)).toBe(true);   // Дополнительно можно проверить роли
  data2.result.roles.forEach(roleItem => {
    expect(roleItem).toHaveProperty('role');
    expect(roleItem.role).toHaveProperty('id');
    expect(roleItem.role).toHaveProperty('name');
    expect(roleItem).toHaveProperty('permissions');
    expect(Array.isArray(roleItem.permissions)).toBe(true);
  });

  console.log('Статус ответа:', response2.status());
  console.log();
  console.log(chalk.cyan('Данные пользователя:', util.inspect(data2.result, { depth: null, colors: true })));

//--------------------Шаг 5. Проверка возможности изменения активности пользователя -------------------

  console.log();
  console.log(chalk.yellow('Шаг 5. Проверка возможности изменения активности пользователя'))
  console.log();

  const requestBody = [{
    "user": {
      "id": id,
      "userId": user.userId,
      "userName": user.userName,
      "status": 1,
    },
    "lastActivityDate": finishDate,
    "lastLoginDate": finishDate,
    "lastLogoutDate": finishDate
}];

  const response3 = await apiContext.post('/User/activities', {data: requestBody});
  const data3 = await response3.json();
  
  expect(data3).toHaveProperty('isSuccess', true);
  if (!response3.ok()) {
  console.error('Ошибка при обновлении активности пользователей:', await response3.text());
}
  console.log('Статус ответа:', response3.status());
  console.log();
  console.log(chalk.cyan('Успешность выполнения запроса:'), util.inspect(data3.isSuccess, { depth: null, colors: true }));
console.log(chalk.cyan('Для пользователя ') + chalk.yellow(id.toString()) + chalk.cyan(' с именем ') + chalk.green(user.userName) + chalk.cyan(' установлена новая дата активности ') + chalk.red(finishDate)
);

//--------------------Шаг 6. Проверка изменения активности пользователя -------------------

  console.log();
  console.log(chalk.yellow('Шаг 6. Проверка изменения активности пользователя в системе'))
  console.log();

  const response4 = await apiContext.get(`/User/activities`);
  const data4 = await response4.json();


  const ourUser = data4.result.find((u: { id: number }) => u.id === id);
    expect(data4).toHaveProperty('isSuccess', true);
    expect(Array.isArray(data4.result)).toBe(true);
    expect(ourUser).toBeDefined(); // Проверяем, что такой пользователь найден

    expect(typeof ourUser.lastActivityDate).toBe('string');
    expect(ourUser.lastActivityDate.trim().length).toBeGreaterThan(0);

    console.log(chalk.cyan('Пользователь с id ') + chalk.yellow(id.toString()) + chalk.cyan(' найден.'));
    console.log(chalk.cyan('Последняя дата активности: '),chalk.red(formatDateOnly(ourUser.lastActivityDate)));
    
  await apiContext.dispose();
});
