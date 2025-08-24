import { test, expect, request } from '@playwright/test';
import util from 'util';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;

test('Тест кейс по ролям 1', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState});

  console.log('\x1b[36m%s\x1b[0m','Попробуем создать какую-нибудь роль..')

//~~~~~~~~~~~~~~~~~~ Step 1  Создать роль ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const randomId = Math.floor(Math.random() * 100);
  const requestBody = {
        "name": `AutotestRole_${randomId}`,
        "description": "Роль для теста 1",
        "permissions": [1]
      };

  let response = await apiContext.post('/Role', {data: requestBody}); // Передаём тело запроса в параметрах post

  let data = await response.json(); // парсим ответ

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true); // проверяем успешность запроса

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status()); // нам все же нужен статус ответа

  const id = data.result.role.id // кладем id из ответа в переменную

  console.log('\x1b[36m%s\x1b[0m', `Роль успешно создана, присвоен id: ${id}. Проверяем информацию о создананной роли...`); // прохождение первого шага
  console.log('Вводные данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 2  Проверить данные ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const roleId = id; // Сюда кладем ID созданной роли

  response = await apiContext.get(`/Role/${roleId}`); // Ищем информацию на сервере о ней

  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true); // проверяем успешность запроса
  expect(data.result.role.name).toBe(requestBody.name); // проверяем соответствие данных ответа с передаваемыми в Пост
  expect(data.result.role.description).toBe(requestBody.description);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m','Роль найдена в системе. Данные соответствуют вводным.')
  console.log('Данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 3  Обновить роль ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const requestBody2 = {
        "newName": `Обновленная_${requestBody.name}`,
        "newDescription": "Обновленная роль для автотеста",
        "permissions": [3, 5, 7]
      };

  response = await apiContext.put(`/Role/${roleId}`, {data: requestBody2});
   
  data = await response.json(); // парсим ответ

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  if (data.isSuccess === false) {
  console.error('Ошибка обновления пользователя:', util.inspect(data, { depth: null, colors: true }));
  expect(data.isSuccess).toBe(true); // проверяем успешность запроса
  
}
//-------------------------Выводы--------------------------------------------

  console.log('\x1b[36m%s\x1b[0m',`Роль' ${id} успешно обновлена.`);
  console.log('Новые данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 4  Добавить разрешения ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const requestBody3 = {
    "permissions": [1, 8]};
  
  response = await apiContext.patch(`/Role/${roleId}/permissions/add`, {data: requestBody3});

  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data).toHaveProperty('isSuccess', true);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Добавлены новые разрешения ${requestBody3.permissions} для роли с id ${roleId}`);
  console.log('Данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 5 Удалить ненужные разрешения ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const requestBody4 = {
    "permissions": [3, 5, 7]};
  
  response = await apiContext.patch(`/Role/${roleId}/permissions/remove`, {data: requestBody4});
  
  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200); // Проверяем статус запроса
  expect(data).toHaveProperty('isSuccess', true);
  
//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Удалены разрешения ${requestBody4.permissions} для роли с id ${roleId}.`);
  console.log('Данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 6 Проверить данные ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  response = await apiContext.get(`/Role/${roleId}`); // 

  data = await response.json();

//---------------------------Проверки----------------------------------------

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true); 
  expect(data.result.role.name).toBe(requestBody2.newName); // проверяем соответствие данных ответа с передаваемыми в Пост
  expect(data.result.role.description).toBe(requestBody2.newDescription);

//-------------------------Выводы--------------------------------------------

  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m','Обновленная роль найдена в системе. Данные соответствуют новым вводным.')
  console.log('Данные:', util.inspect(data.result, { depth: null, colors: true }));

//~~~~~~~~~~~~~~~~~~ Step 7 Удаляем роль ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

response = await apiContext.delete(`/Role/${roleId}`); 

data = await response.json();

//---------------------------Проверки----------------------------------------

expect(response.status()).toBe(200); 
expect(data).toHaveProperty('isSuccess', true);

//-------------------------Выводы--------------------------------------------

console.log('Статус ответа:', response.status());
console.log('\x1b[36m%s\x1b[0m', `Удалена роль с id ${data.result}`);
console.log(data);

//~~~~~~~~~~~~~~~~~~ Step 8 Получаем информацию о всех ролях ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

response = await apiContext.get('/Role');

data = await response.json(); // Формируем json ответа

//---------------------------Проверки----------------------------------------

expect(response.status()).toBe(200);
expect(data).toHaveProperty('result');
expect(Array.isArray(data.result)).toBe(true);
 
for (const roleItem of data.result) {  // Проверяем каждый элемент массива result
  expect(roleItem).toHaveProperty('role');
  expect(roleItem.role).toHaveProperty('id');
  expect(roleItem.role).toHaveProperty('name');
  expect(roleItem.role).toHaveProperty('description');
}
//-------------------------Выводы--------------------------------------------

console.log('Статус ответа:', response.status());
const found = data.result.some(item => item.role.id === roleId);

if (!found) {
  console.log(`Тест пройден. Пользователь с id ${roleId} успешно удалён из системы.`);
} else {
  console.log(`Id ${roleId} найден в системе. Удаление произошло неуспешно.`);
}
//-------------------Добиваем проверкой по id----------------------------------

response = await apiContext.get(`/Role/${roleId}`);
data = await response.json();
const isCorrectResponse = 
  data.isSuccess === true &&
  Object.keys(data.result).length === 1 && // только одно поле в result
  Array.isArray(data.result.permissions) &&
  data.result.permissions.length === 0;

if (isCorrectResponse) {
  console.log('Ответ корректный — permissions пусты, других данных нет');
} else {
  console.log('Тест провален: в ответе есть данные в result');
}
await apiContext.dispose();
});
