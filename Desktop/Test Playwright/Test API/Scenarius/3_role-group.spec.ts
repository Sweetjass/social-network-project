import { test, expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;

test('Тест кейс по ролям 1', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState});

  console.log('\x1b[36m%s\x1b[0m','Попробуем создать какую-нибудь роль с информацией о группе разрешений..')

//~~~~~~~~~~~~~~~~~~ Step 1  Создать роль ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const randomId = Math.floor(Math.random() * 1000);
    const requestBody = {
      "name": `Role-group_${randomId}`,
      "description": "Autotest 2",
      "groups": [
        {
          "groupType": 8,
          "enabledPermissions": [122, 123, 124]
        }
      ]
    }
    let response = await apiContext.post('/Role/groups', {data: requestBody});
    let data = await response.json();
    const roleId = data.result.role.id // кладем id из ответа в переменную roleId
//---------------------------Проверки----------------------------------------
  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true); // проверяем успешность запроса
  expect(data.result.role.name).toBe(requestBody.name);
  expect(data.result.role.description).toBe(requestBody.description);
  expect(data.result.groups).toBeDefined();
  expect(Array.isArray(data.result.groups)).toBeTruthy();
  let group = data.result.groups[0]; // Проверяем первую группу
  expect(group.groupType).toBe(8);
  expect(group.enabledPermissions).toEqual([122, 123, 124]);
//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status()); // нам все же нужен статус ответа
  console.log('\x1b[36m%s\x1b[0m', `Роль ${data.result.role.name} успешно создана, присвоен id: ${roleId}. Проверяем информацию о создананной роли...`); // прохождение первого шага
  console.log('Вводные данные:', util.inspect(data, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 2  Проверить данные ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

response = await apiContext.get('/Role/groups');
data = await response.json(); 

//---------------------------Проверки----------------------------------------

const createdRole = data.result.find(roleItem => roleItem.role.id === roleId);
expect(createdRole).toBeDefined(); // Роль должна быть найдена
expect(createdRole!.role.name).toBe(requestBody.name);
expect(createdRole!.role.description).toBe(requestBody.description);
const expectedGroup = requestBody.groups[0];
const matchingGroup = createdRole!.groups.find(group =>
  group.groupType === expectedGroup.groupType &&
  Array.isArray(group.enabledPermissions) &&
  group.enabledPermissions.length === expectedGroup.enabledPermissions.length &&
  group.enabledPermissions.slice().sort().every((perm, idx) => perm === expectedGroup.enabledPermissions.slice().sort()[idx])
);
expect(response.status()).toBe(200); // Проверяем статус запроса
expect(matchingGroup).toBeDefined();

//-------------------------Выводы--------------------------------------------

console.log('Статус ответа:', response.status()); // Выводим статус
if (matchingGroup) {
  console.log(`\x1b[36m%s\x1b[0m`, `Проверка пройдена. Роль с id = ${roleId} содержит группу groupType = ${expectedGroup.groupType} с разрешениями [${expectedGroup.enabledPermissions.join(', ')}].`);
} else {
  console.log(`\x1b[31m%s\x1b[0m`, `Ошибка: Роль с id= ${roleId} не содержит нужную группу с заданными разрешениями.`);
}

//~~~~~~~~~~~~~~~~~~ Step 3 Удаляем роль ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

response = await apiContext.delete(`/Role/${roleId}`); 

data = await response.json();

//---------------------------Проверки----------------------------------------

expect(response.status()).toBe(200); 
expect(data).toHaveProperty('isSuccess', true);

//-------------------------Выводы--------------------------------------------

console.log('Статус ответа:', response.status());
console.log('\x1b[36m%s\x1b[0m', `Удалена роль с id ${data.result}`);
console.log(data);

//~~~~~~~~~~~~~~~~~~ Step 4 Проверяем удалена ли роль с id ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

response = await apiContext.get(`/Role/${roleId}/groups`);
data = await response.json();

//---------------------------Проверки----------------------------------------

const isCorrectResponse =
  data.isSuccess === true &&
  data.result &&
  Array.isArray(data.result.groups) &&
  data.result.groups.length === 0 &&
  Array.isArray(data.errorResult) &&
  data.errorResult.length === 0;
  
//-------------------------Выводы--------------------------------------------

if (isCorrectResponse) {
  console.log('\x1b[36m%s\x1b[0m', 'Ответ корректный — groups пусты, других данных нет');
} else {
  console.log('\x1b[31m%s\x1b[0m','Тест провален: в ответе есть данные в result', data);
}
await apiContext.dispose();
});
