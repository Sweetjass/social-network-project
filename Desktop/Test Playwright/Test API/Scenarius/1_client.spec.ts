import { test, expect, request } from '@playwright/test';
import util from 'util';
require('dotenv').config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState;

// ====== Шаг 1: Создаем клиента ======

console.log('\x1b[36m%s\x1b[0m', 'Попробуем создать клиента..');
test('Client autotest', async () => {
  const apiContext = await request.newContext({
    baseURL,
    storageState});

  const randomId = Math.floor(Math.random() * 100);
 
  const requestBody = {
    name: `TestClient_${randomId}`,
    clientId: `${randomId}`,
    allowedCorsOrigins: ['AutoTestClient'],
  };

  let response = await apiContext.post('/Client', { data: requestBody });
  let data = await response.json();

  // --- Проверки ---

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  expect(data.result).toMatchObject(requestBody);
  expect(data.result.id).toBeTruthy();

  // --- Выводы ---
  
  const id = data.result.id
  console.log('Статус ответа:', response.status());
  console.log('\x1b[36m%s\x1b[0m', `Создан клиент с id ${id}. Данные по клиенту:`, util.inspect(data.result, { depth: null, colors: true }));

  // ====== Шаг 2: Проверяем созданного клиента ======

  console.log('\x1b[36m%s\x1b[0m', 'Ищем созданного клиента в системе..');

  response = await apiContext.get(`/Client?ids=${id}`);
  data = await response.json();

  // --- Проверки ---

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  expect(data.result.find((c: any) => c.id === id)).toBeDefined();
  expect(data.result.find((c: any) => c.id === id)).toMatchObject(requestBody);

  // --- Выводы ---

  console.log('\x1b[36m%s\x1b[0m', 'Данные созданного клиента найдены в системе:', util.inspect(data.result, { depth: null, colors: true }));

  // ====== Шаг 3: Обновляем клиента ======

  console.log('\x1b[36m%s\x1b[0m', 'Начинаем обновление данных клиента...');

  const requestBody2 = {
    id: id,
    name: `Update_Client_${randomId}`,
    clientId: `Upd:${randomId}`,
    allowedCorsOrigins: ["delete"]
  };

  response = await apiContext.put('/Client', { data: requestBody2 });
  data = await response.json();

  // --- Проверки ---

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  expect(data.result).toMatchObject(requestBody2);
  expect(data.result.id).toBe(id);

  // --- Выводы ---
  
  console.log('\x1b[36m%s\x1b[0m', `Обновлен клиент с id ${id}. Данные обновленного клиента:`, util.inspect(data.result, { depth: null, colors: true }));
  

  // ====== Шаг 4: Проверяем обновленного клиента ======

  console.log('\x1b[36m%s\x1b[0m','Подтверждаем информацию об обновлении клиента в системе.. ');

  response = await apiContext.get(`/Client?ids=${id}`);
  data = await response.json();

  // --- Проверки ---

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  expect(data.result.find((c: any) => c.id === id)).toBeDefined();
  expect(data.result.find((c: any) => c.id === id)).toMatchObject(requestBody2);

  // --- Выводы ---

  console.log('\x1b[36m%s\x1b[0m', 'Клиент с обновленной информацией определен системой. Данные клиента после обновления:', util.inspect(data.result, { depth: null, colors: true }));

  // ====== Шаг 5: Удаляем клиента ======

  console.log('\x1b[36m%s\x1b[0m', 'Уничтожаем сущность данного клиента...');

  response = await apiContext.delete(`/Client/${id}`);
  data = await response.json();

  // --- Проверки ---

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);

  // --- Выводы ---

  console.log('\x1b[36m%s\x1b[0m', `Клиент c id ${id} успешно удален.`);
  console.log(util.inspect(data, { depth: null, colors: true }));

  // ====== Шаг 6: Проверяем отсутствие клиента ======

  console.log('\x1b[36m%s\x1b[0m', 'Подтверждаем удаление клиента...');

  response = await apiContext.get(`/Client?ids=${id}`);
  data = await response.json();

  // --- Проверки ---

  expect(response.status()).toBe(200);
  expect(data.isSuccess).toBe(true);
  expect(data.result.find((c: any) => c.id === id)).toBeUndefined();

  // --- Выводы ---

  console.log('\x1b[36m%s\x1b[0m','Клиент отсутствует в системе после удаления. Тест пройден успешно.');
  console.log(util.inspect(data.result, { depth: null, colors: true }));

  await apiContext.dispose();
});
